<?php

namespace App\Observers;

use App\Services\SkillPointService;
use App\Models\StudentProgress;
use App\Models\CourseEnrollment;
use App\Models\AssignmentSubmission;
use App\Models\QuizSubmission;
use Carbon\Carbon;

class StudentProgressObserver
{
    protected $skillPointService;

    public function __construct(SkillPointService $skillPointService)
    {
        $this->skillPointService = $skillPointService;
    }

    public function created(StudentProgress $progress)
    {
        $this->skillPointService->processCourseMaterialSkillPoints($progress);
        $this->checkAndUpdateEnrollmentProgress($progress->courseEnrollment);
    }

    private function checkAndUpdateEnrollmentProgress($enrollment)
    {
        $courseBatch = $enrollment->courseBatch;
        $courseId = $courseBatch->id_course;

        $totalMaterials = $courseBatch->course->materials()->count();
        $totalAssignments = $courseBatch->course->assignments()->count();
        $totalQuizzes = $courseBatch->course->quizzes()->count();

        $total = $totalMaterials + $totalAssignments + $totalQuizzes;

        $completedMaterials = StudentProgress::where('id_course_enrollment', $enrollment->id_course_enrollment)->count();
        $completedAssignments = AssignmentSubmission::where('id_course_enrollment', $enrollment->id_course_enrollment)
            ->whereNotNull('grade')
            ->count();
        $completedQuizzes = QuizSubmission::where('id_course_enrollment', $enrollment->id_course_enrollment)
            ->where('status', 'completed')
            ->distinct('id_quiz')
            ->count('id_quiz');

        $completed = $completedMaterials + $completedAssignments + $completedQuizzes;

        $progress = $total > 0 ? ($completed / $total) * 100 : 0;

        if ($progress >= 100 && $enrollment->status !== 'completed') {
            $enrollment->update([
                'status' => 'completed',
                'completed_at' => Carbon::now()
            ]);
            $this->skillPointService->addCompletionPoints($enrollment);
        }
    }
}
