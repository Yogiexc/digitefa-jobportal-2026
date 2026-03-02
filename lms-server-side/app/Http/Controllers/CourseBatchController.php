<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseBatch;
use App\Models\CourseMaterial;
use App\Models\CourseAssignment;
use App\Models\Quiz;
use App\Models\StudentProgress;
use App\Models\AssignmentSubmission;
use App\Models\QuizSubmission;
use App\Models\Teacher;

class CourseBatchController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course' => 'nullable|exists:courses,id_course',
            'capacity' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|in:open,closed',
        ]);
    }

    public function index()
    {
        $courseBatches = CourseBatch::with(['course', 'enrollments.student'])->get();
        return response()->json($courseBatches);
    }

    public function show($id)
    {
        $courseBatch = CourseBatch::with(['course', 'enrollments.student'])->findOrFail($id);

        $courseId = $courseBatch->id_course;

        $totalMaterials = CourseMaterial::join('course_sections', 'course_sections.id_course_section', '=', 'course_materials.id_course_section')
            ->where('course_sections.id_course', $courseId)
            ->count();

        $totalAssignments = CourseAssignment::join('course_sections', 'course_sections.id_course_section', '=', 'course_assignments.id_course_section')
            ->where('course_sections.id_course', $courseId)
            ->count();

        $totalQuizzes = Quiz::join('course_sections', 'course_sections.id_course_section', '=', 'quizzes.id_course_section')
            ->where('course_sections.id_course', $courseId)
            ->count();

        $total = $totalMaterials + $totalAssignments + $totalQuizzes;

        foreach ($courseBatch->enrollments as $enrollment) {
            $id_course_enrollment = $enrollment->id_course_enrollment;

            $completedMaterials = StudentProgress::where('id_course_enrollment', $id_course_enrollment)->count();
            $completedAssignments = AssignmentSubmission::where('id_course_enrollment', $id_course_enrollment)
                ->whereNotNull('grade')
                ->count();
            $completedQuizzes = QuizSubmission::where('id_course_enrollment', $id_course_enrollment)
                ->where('status', 'completed')
                ->distinct('id_quiz')
                ->count('id_quiz');

            $completed = $completedMaterials + $completedAssignments + $completedQuizzes;

            $progress = $total > 0 ? ($completed / $total) * 100 : 0;
            $progress = round($progress, 2);

            $enrollment->progress = $progress;
        }

        return response()->json($courseBatch);
    }

    public function getBatchesByCourse($id)
    {
        $courseBatches = CourseBatch::with(['course', 'enrollments.student'])
            ->where('id_course', $id)
            ->get();

        return response()->json($courseBatches);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $courseBatch = CourseBatch::create($validated);

        return response()->json([
            'status_code' => 201,
            'success' => true,
            'message' => 'Course batch created successfully',
            'course_batch' => $courseBatch,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $courseBatch = CourseBatch::findOrFail($id);
        $courseBatch->update($validated);

        return response()->json([
            'status_code' => 200,
            'success' => true,
            'message' => 'Course batch updated successfully',
            'course_batch' => $courseBatch,
        ]);
    }

    public function destroy($id)
    {
        $courseBatch = CourseBatch::findOrFail($id);
        $courseBatch->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course batch deleted successfully',
        ], 200);
    }

    public function getStudentActivities($id)
    {
        $courseBatch = CourseBatch::with(['course', 'enrollments.student.user'])->findOrFail($id);
        $formattedActivities = [];

        foreach ($courseBatch->enrollments as $enrollment) {
            $student = $enrollment->student;
            $studentName = $student->user->name;
            $id_course_enrollment = $enrollment->id_course_enrollment;

            $progress = StudentProgress::where('id_course_enrollment', $id_course_enrollment)
                ->get()
                ->map(function ($item) use ($studentName) {
                    return [
                        'id_student_progress' => $item->id_student_progress,
                        'name_student' => $studentName,
                        'activity_type' => 'Watched Video',
                        'date' => $item->created_at->format('d-m-Y'),
                        'status' => 'Completed'
                    ];
                });

            $assignments = AssignmentSubmission::where('id_course_enrollment', $id_course_enrollment)
                ->get()
                ->map(function ($item) use ($studentName) {
                    return [
                        'id_assignment_submission' => $item->id_assignment_submission,
                        'name_student' => $studentName,
                        'activity_type' => 'Submitted Assignment',
                        'date' => $item->created_at->format('d-m-Y'),
                        'status' => $item->grade !== null ? 'Completed' : 'Not Yet Rated'
                    ];
                });

            $quizzes = QuizSubmission::where('id_course_enrollment', $id_course_enrollment)
                ->get()
                ->map(function ($item) use ($studentName) {
                    $status = 'Completed';
                    if ($item->status === 'completed' && $item->grade === null) {
                        $status = 'Not Yet Rated';
                    }

                    return [
                        'id_quiz_submission' => $item->id_quiz_submission,
                        'name_student' => $studentName,
                        'activity_type' => 'Quiz Submitted',
                        'date' => $item->created_at->format('d-m-Y'),
                        'status' => $status
                    ];
                });

            $formattedActivities = array_merge(
                $formattedActivities,
                $progress->toArray(),
                $assignments->toArray(),
                $quizzes->toArray()
            );
        }

        usort($formattedActivities, function ($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'activities' => $formattedActivities
        ], 200);
    }

    public function getCourseBatchByTeacher($idTeacher)
    {
        $courseBatches = CourseBatch::with(['course'])
            ->whereHas('course', function ($query) use ($idTeacher) {
                $query->where('id_teacher', $idTeacher);
            })
            ->get();

        $courseBatches->each(function ($courseBatch) {
            $courseBatch->total_students = $courseBatch->enrollments->count();

            $totalActivities = 0;

            foreach ($courseBatch->enrollments as $enrollment) {
                $totalActivities += StudentProgress::where('id_course_enrollment', $enrollment->id_course_enrollment)->count();
                $totalActivities += AssignmentSubmission::where('id_course_enrollment', $enrollment->id_course_enrollment)->count();
                $totalActivities += QuizSubmission::where('id_course_enrollment', $enrollment->id_course_enrollment)->count();
            }

            $courseBatch->total_activities = $totalActivities;
        });

        return response()->json($courseBatches);
    }
}
