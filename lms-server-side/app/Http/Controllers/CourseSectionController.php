<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseSection;
use App\Models\StudentProgress;
use App\Models\AssignmentSubmission;
use App\Models\QuizSubmission;

class CourseSectionController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course' => 'required|exists:courses,id_course',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
    }

    public function index(Request $request)
    {
        $request->validate([
            'id_course' => 'required|exists:courses,id_course',
        ]);

        $id_course = $request->input('id_course');
        $courseSections = CourseSection::with('course', 'materials', 'assignments', 'quizzes')
            ->where('id_course', $id_course)
            ->get();
        return response()->json($courseSections);
    }

    public function show($id)
    {
        $courseSection = CourseSection::with('course', 'materials', 'assignments', 'quizzes')->findOrFail($id);
        return response()->json($courseSection);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $courseSection = CourseSection::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Course section created successfully',
            'course_section' => $courseSection,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $courseSection = CourseSection::findOrFail($id);
        $courseSection->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course section updated successfully',
            'course_section' => $courseSection,
        ], 200);
    }

    public function destroy($id)
    {
        $courseSection = CourseSection::findOrFail($id);
        $courseSection->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course section deleted successfully'
        ], 200);
    }

    public function getSectionsWithProgress(Request $request)
    {
        $request->validate([
            'id_course' => 'required|exists:courses,id_course',
            'id_course_enrollment' => 'required|exists:course_enrollments,id_course_enrollment'
        ]);

        $id_course = $request->input('id_course');
        $id_course_enrollment = $request->input('id_course_enrollment');

        $courseSections = CourseSection::with([
            'materials:id_course_material,id_course_section,title',
            'assignments:id_course_assignment,id_course_section,title',
            'quizzes:id_quiz,id_course_section,title'
        ])
            ->select('id_course_section', 'title')
            ->where('id_course', $id_course)
            ->get();

        $materialProgress = StudentProgress::where('id_course_enrollment', $id_course_enrollment)
            ->pluck('id_course_material')
            ->toArray();

        $completedAssignments = AssignmentSubmission::where('id_course_enrollment', $id_course_enrollment)
            ->pluck('id_course_assignment')
            ->toArray();

        $completedQuizzes = QuizSubmission::where('id_course_enrollment', $id_course_enrollment)
            ->where('status', 'completed')
            ->pluck('id_quiz')
            ->toArray();

        $sectionsWithProgress = $courseSections->map(function ($section) use ($materialProgress, $completedAssignments, $completedQuizzes) {
            $sectionData = [
                'id_course_section' => $section->id_course_section,
                'title' => $section->title,
            ];

            $sectionData['materials'] = $section->materials->map(function ($material) use ($materialProgress) {
                return [
                    'id_course_material' => $material->id_course_material,
                    'title' => $material->title,
                    'is_completed' => in_array($material->id_course_material, $materialProgress)
                ];
            });

            $sectionData['assignments'] = $section->assignments->map(function ($assignment) use ($completedAssignments) {
                return [
                    'id_course_assignment' => $assignment->id_course_assignment,
                    'title' => $assignment->title,
                    'is_completed' => in_array($assignment->id_course_assignment, $completedAssignments)
                ];
            });

            $sectionData['quizzes'] = $section->quizzes->map(function ($quiz) use ($completedQuizzes) {
                return [
                    'id_quiz' => $quiz->id_quiz,
                    'title' => $quiz->title,
                    'is_completed' => in_array($quiz->id_quiz, $completedQuizzes)
                ];
            });

            return $sectionData;
        });

        return response()->json([
            'sections' => $sectionsWithProgress,
        ]);
    }
}
