<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\StudentProgress;
use App\Models\CourseEnrollment;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseAssignment;
use App\Models\Quiz;
use App\Models\AssignmentSubmission;
use App\Models\QuizSubmission;
use App\Models\CourseBatch;
use Carbon\Carbon;

class StudentProgressController extends Controller
{
    private function updateEnrollmentStatus($enrollment, $progress)
    {
        if ($progress >= 100 && $enrollment->status !== 'completed') {
            $enrollment->update([
                'status' => 'completed',
                'completed_at' => Carbon::now()
            ]);

            return true;
        }
        return false;
    }

    public function getProgressStudent($id_course_enrollment)
    {
        $enrollment = CourseEnrollment::with('student')->findOrFail($id_course_enrollment);
        $courseBatch = CourseBatch::findOrFail($enrollment->id_course_batch);
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

        $completedMaterials = StudentProgress::where('id_course_enrollment', $id_course_enrollment)->count();
        $completedAssignments = AssignmentSubmission::where('id_course_enrollment', $id_course_enrollment)
            ->count();
        $completedQuizzes = QuizSubmission::where('id_course_enrollment', $id_course_enrollment)
            ->where('status', 'completed')
            ->distinct('id_quiz')
            ->count('id_quiz');

        $completed = $completedMaterials + $completedAssignments + $completedQuizzes;

        $progress = $total > 0 ? ($completed / $total) * 100 : 0;
        $progress = round($progress, 2);

        $isCompleted = $this->updateEnrollmentStatus($enrollment, $progress);

        $latestProgress = StudentProgress::where('id_course_enrollment', $id_course_enrollment)
            ->orderBy('updated_at', 'desc')
            ->first();

        $latestCourseMaterialId = $latestProgress ? $latestProgress->id_course_material : null;

        return response()->json([
            'progress' => $progress,
            'completed' => $completed,
            'total' => $total,
            'latest_course_material_id' => $latestCourseMaterialId,
            'enrollment_status' => $enrollment->status,
            'completed_at' => $enrollment->completed_at,
            'is_newly_completed' => $isCompleted
        ]);
    }

    public function getLatestStudentProgress($id_course_enrollment)
    {
        $enrollment = CourseEnrollment::with('student')->findOrFail($id_course_enrollment);

        $latestProgress = StudentProgress::where('id_course_enrollment', $id_course_enrollment)
            ->orderBy('updated_at', 'desc')
            ->first();

        if (!$latestProgress) {
            return response()->json(['message' => 'No progress found'], 404);
        }

        $material = CourseMaterial::findOrFail($latestProgress->id_course_material);

        return response()->json([
            'id_course_material' => $material->id_course_material,
            'enrollment_status' => $enrollment->status,
            'completed_at' => $enrollment->completed_at
        ]);
    }
}
