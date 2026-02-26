<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class CourseController extends Controller
{

    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_category' => 'required|exists:categories,id_category',
            'id_teacher' => 'required|exists:teachers,id_teacher',
            'id_course_level' => 'required|exists:course_levels,id_course_level',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            'thumbnail_link' => 'nullable|url',
            'description' => 'nullable|string',
            'rules' => 'nullable|string',
            'duration' => 'nullable|integer',
            'tools' => 'nullable|array',
            'tools.*' => 'exists:tools,id_tool',
        ]);
    }

    private function isAllowedCourseLevel($courseLevelId, $teacherId)
    {
        $teacher = Teacher::findOrFail($teacherId);

        $teacherLevelId = $teacher->id_teacher_level;

        $hasAccess = DB::table('teacher_level_course_level')
            ->where('id_teacher_level', $teacherLevelId)
            ->where('id_course_level', $courseLevelId)
            ->exists();

        Log::info('Teacher Level Access Check', [
            'id_teacher_level' => $teacherLevelId,
            'id_course_level' => $courseLevelId,
            'has_access' => $hasAccess,
        ]);

        return $hasAccess;
    }

    public function index()
    {
        $courses = Course::with([
            'teacher.user',
            'courseLevels',
            'category'
        ])->get();

        return response()->json($courses);
    }

    public function show($id)
    {
        $course = Course::with([
            'teacher.user',
            'category',
            'sections',
            'courseLevels',
            'tools'
        ])->findOrFail($id);

        return response()->json($course);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        if (!$this->isAllowedCourseLevel($validated['id_course_level'], $validated['id_teacher'])) {
            return response()->json([
                'success' => false,
                'status_code' => 403,
                'message' => 'You do not have access to create a course at this level.',
            ], 403);
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $this->storeFile($request->file('thumbnail'));
        }

        $course = Course::create($validated);

        if ($request->has('tools')) {
            $course->tools()->sync($request->input('tools'));
        }

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Course created successfully.',
            'course' => $course,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $course = Course::findOrFail($id);

        if (!$this->isAllowedCourseLevel($validated['id_course_level'], $validated['id_teacher'])) {
            return response()->json([
                'success' => false,
                'status_code' => 403,
                'message' => 'You do not have access to update a course at this level.',
            ], 403);
        }

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail) {
                $this->deleteOldFile($course->thumbnail);
            }
            $validated['thumbnail'] = $this->storeFile($request->file('thumbnail'));
        }

        $course->update($validated);

        if ($request->has('tools')) {
            $course->tools()->sync($request->input('tools'));
        }

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course updated successfully.',
            'course' => $course,
        ], 200);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);

        if ($course->thumbnail) {
            $this->deleteOldFile($course->thumbnail);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course deleted successfully.',
        ], 200);
    }

    private function storeFile($file)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $uniqueFileName = $fileName . '_' . time() . '.' . $extension;

        $file->move('uploads/Courses/Thumbnail', $uniqueFileName);
        return $uniqueFileName;
    }

    private function deleteOldFile($filename)
    {
        $filePath = public_path('uploads/Courses/Thumbnail/' . $filename);

        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function getTeacherCourses($id)
    {
        $courses = Course::with([
            'teacher.user',
            'category',
            'courseLevels',
            'tools'
        ])
            ->where('id_teacher', $id)
            ->get();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'courses' => $courses,
        ], 200);
    }

    public function CourseById()
    {
        $courses = Course::with([
            'teacher.user',
            'category',
            'batches' => function ($query) {
                $query->where('status', 'open');
            }
        ])
            ->whereHas('batches', function ($query) {
                $query->where('status', 'open');
            })
            ->get();

        $coursesData = $courses->map(function ($course) {
            $course->batches = $course->batches->map(function ($batch) {
                return [
                    'start_date' => $batch->start_date,
                    'end_date' => $batch->end_date,
                ];
            });

            return $course;
        });

        return response()->json($coursesData);
    }

    public function allCourse()
    {
        $courses = new Course();
        $courses = $courses->get();

        return response()->json($courses);
    }

    public function getCourseRecommendations(Request $request)
    {
        $response = Http::post('http://localhost:9090/recommend-courses', [
            'job_id' => $request->job_id
        ]);

        return $response->json();
    }
}
