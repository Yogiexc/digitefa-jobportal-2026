<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseEnrollment;
use App\Models\CourseBatch;
use App\Models\Course;

class CourseEnrollmentController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course_batch' => 'required|exists:course_batches,id_course_batch',
            'id_student' => 'required|exists:students,id_student',
        ]);
    }

    public function index()
    {
        $enrollments = CourseEnrollment::with(['courseBatch.course', 'student.user'])->get();
        return response()->json($enrollments);
    }

    public function show($id)
    {
        $enrollment = CourseEnrollment::with(['courseBatch.course', 'student.user'])->findOrFail($id);
        return response()->json($enrollment);
    }

    public function showByCourse($id_course)
    {
        $course = Course::findOrFail($id_course);
        $enrollments = CourseEnrollment::with(['courseBatch.course', 'student.user'])
            ->whereHas('courseBatch', function ($query) use ($id_course) {
                $query->where('id_course', $id_course);
            })
            ->get();

        return response()->json([
            'course' => $course,
            'enrollments' => $enrollments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        $courseBatch = CourseBatch::with('course')->findOrFail($validated['id_course_batch']);

        if ($courseBatch->status !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Batch is not open for enrollment',
            ], 400);
        }

        $existingEnrollment = CourseEnrollment::where('id_course_batch', $validated['id_course_batch'])
            ->where('id_student', $validated['id_student'])
            ->first();

        if ($existingEnrollment) {
            return response()->json([
                'success' => false,
                'message' => 'Student is already enrolled in this batch',
            ], 400);
        }

        $currentEnrollments = $courseBatch->enrollments()->count();
        if ($currentEnrollments >= $courseBatch->capacity) {
            return response()->json([
                'success' => false,
                'message' => 'Batch is full',
            ], 400);
        }

        $course = $courseBatch->course;

        $startDate = now()->toDateString();
        $endDate = now()->addDays($course->duration)->toDateString();

        $enrollment = CourseEnrollment::create([
            'id_course_batch' => $validated['id_course_batch'],
            'id_student' => $validated['id_student'],
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Enrollment created successfully',
            'enrollment' => $enrollment,
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);

        $enrollment = CourseEnrollment::findOrFail($id);

        $enrollment->update($validated);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Enrollment updated successfully',
            'enrollment' => $enrollment,
        ], 200);
    }

    public function destroy($id)
    {
        $enrollment = CourseEnrollment::findOrFail($id);
        $enrollment->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Enrollment deleted successfully',
        ], 200);
    }

    public function getStudentEnrollments($id)
    {
        $enrollments = CourseEnrollment::with(['courseBatch', 'courseBatch.course'])
            ->whereHas('student', function ($query) use ($id) {
                $query->where('id_user', $id);
            })
            ->get();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'enrollments' => $enrollments,
        ], 200);
    }
}
