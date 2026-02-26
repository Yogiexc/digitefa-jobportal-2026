<?php

namespace App\Services;

use App\Models\Category;
use App\Models\CourseEnrollment;
use App\Models\PointHistory;
use App\Models\StudentProgress;
use App\Models\StudentSkillPoint;
use App\Models\AssignmentSubmission;
use App\Models\QuizSubmission;
use Illuminate\Support\Facades\DB;

class SkillPointService
{
    public function processCourseMaterialSkillPoints(StudentProgress $progress)
    {
        $courseMaterial = $progress->courseMaterial;
        $courseLevel = $progress->courseEnrollment->courseBatch->course->courseLevels;
        $basePoint = $courseLevel->point_course_material;

        $skills = $courseMaterial->skills;

        DB::transaction(function () use ($progress, $skills, $basePoint) {
            foreach ($skills as $skill) {
                $pointHistory = PointHistory::create([
                    'id_student' => $progress->courseEnrollment->id_student,
                    'id_course_enrollment' => $progress->courseEnrollment->id_course_enrollment,
                    'id_skill' => $skill->id_skill,
                    'source_id' => $progress->id_course_material,
                    'source_type' => PointHistory::SOURCE_TYPE['COURSE_MATERIAL'],
                    'point' => $basePoint
                ]);

                StudentSkillPoint::updateOrCreate(
                    [
                        'id_student' => $progress->courseEnrollment->id_student,
                        'id_skill' => $skill->id_skill
                    ],
                    [
                        'point' => DB::raw('point + ' . $basePoint)
                    ]
                );
            }
        });
    }

    public function processAssignmentSkillPoints(AssignmentSubmission $submission)
    {
        $assignment = $submission->courseAssignment;
        $courseLevel = $submission->courseEnrollment->courseBatch->course->courseLevels;
        $basePoint = $courseLevel->point_assignment;

        $skills = $assignment->skills;

        DB::transaction(function () use ($submission, $skills, $basePoint) {
            $gradePercentage = $submission->grade / 100;
            $calculatedPoint = $basePoint * $gradePercentage;

            foreach ($skills as $skill) {
                $pointHistory = PointHistory::create([
                    'id_student' => $submission->courseEnrollment->id_student,
                    'id_course_enrollment' => $submission->courseEnrollment->id_course_enrollment,
                    'id_skill' => $skill->id_skill,
                    'source_id' => $submission->id_assignment_submission,
                    'source_type' => PointHistory::SOURCE_TYPE['ASSIGNMENT_SUBMISSION'],
                    'point' => $calculatedPoint
                ]);

                StudentSkillPoint::updateOrCreate(
                    [
                        'id_student' => $submission->courseEnrollment->id_student,
                        'id_skill' => $skill->id_skill
                    ],
                    [
                        'point' => DB::raw('point + ' . $calculatedPoint)
                    ]
                );
            }
        });
    }

    public function processQuizSkillPoints(QuizSubmission $submission)
    {
        $highestAttempt = QuizSubmission::where('id_quiz', $submission->id_quiz)
            ->where('id_course_enrollment', $submission->id_course_enrollment)
            ->where('status', 'completed')
            ->whereNotNull('grade')
            ->orderBy('attempt_number', 'desc')
            ->first();

        if ($highestAttempt->id_quiz_submission !== $submission->id_quiz_submission) {
            return;
        }

        DB::transaction(function () use ($submission) {
            PointHistory::where('id_course_enrollment', $submission->id_course_enrollment)
                ->where('source_type', PointHistory::SOURCE_TYPE['QUIZ_SUBMISSION'])
                ->whereIn('source_id', function ($query) use ($submission) {
                    $query->select('id_quiz_submission')
                        ->from('quiz_submissions')
                        ->where('id_quiz', $submission->id_quiz)
                        ->where('id_course_enrollment', $submission->id_course_enrollment);
                })
                ->get()
                ->each(function ($pointHistory) {
                    StudentSkillPoint::where('id_student', $pointHistory->id_student)
                        ->where('id_skill', $pointHistory->id_skill)
                        ->update([
                            'point' => DB::raw('point - ' . $pointHistory->point)
                        ]);

                    $pointHistory->delete();
                });
        });

        $quiz = $submission->quiz;
        $courseLevel = $submission->courseEnrollment->courseBatch->course->courseLevels;
        $basePoint = $courseLevel->point_quiz;

        $correctAnswers = 0;
        $answers = $submission->answers;
        $answersGrouped = $answers->groupBy('id_quiz_question');

        foreach ($quiz->questions as $question) {
            if ($question->type === 'single_choice') {
                $answer = $answers->where('id_quiz_question', $question->id_quiz_question)->first();
                if ($answer) {
                    $selectedOption = $question->options->where('id_quiz_option', $answer->id_quiz_option)->first();
                    if ($selectedOption && $selectedOption->is_correct) {
                        $correctAnswers++;
                    }
                }
            } elseif ($question->type === 'multiple_choice') {
                $questionAnswers = $answersGrouped->get($question->id_quiz_question, collect());
                $correctOptions = $question->options->where('is_correct', true);
                $selectedOptionIds = $questionAnswers->pluck('id_quiz_option');

                if (
                    $selectedOptionIds->count() === $correctOptions->count() &&
                    $selectedOptionIds->diff($correctOptions->pluck('id_quiz_option'))->isEmpty()
                ) {
                    $correctAnswers++;
                }
            }
        }

        $totalPoints = $correctAnswers * $basePoint;
        $skills = $quiz->skills;

        DB::transaction(function () use ($submission, $skills, $totalPoints) {
            foreach ($skills as $skill) {
                PointHistory::create([
                    'id_student' => $submission->courseEnrollment->id_student,
                    'id_course_enrollment' => $submission->courseEnrollment->id_course_enrollment,
                    'id_skill' => $skill->id_skill,
                    'source_id' => $submission->id_quiz_submission,
                    'source_type' => PointHistory::SOURCE_TYPE['QUIZ_SUBMISSION'],
                    'point' => $totalPoints,
                ]);

                StudentSkillPoint::updateOrCreate(
                    [
                        'id_student' => $submission->courseEnrollment->id_student,
                        'id_skill' => $skill->id_skill,
                    ],
                    [
                        'point' => DB::raw('point + ' . $totalPoints),
                    ]
                );
            }
        });
    }

    public function getStudentSkillPoints($studentId)
    {
        return StudentSkillPoint::where('id_student', $studentId)
            ->with('skill')
            ->get();
    }

    public function getSkillPointHistory($studentId, $skillId = null)
    {
        $query = PointHistory::where('id_student', $studentId)
            ->with([
                'courseEnrollment.course',
                'skill'
            ]);

        if ($skillId) {
            $query->where('id_skill', $skillId);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getStudentSkillPointsWithCategories($studentId)
    {
        $categories = Category::with(['skills' => function ($query) use ($studentId) {
            $query->leftJoin('student_skill_points', function ($join) use ($studentId) {
                $join->on('skills.id_skill', '=', 'student_skill_points.id_skill')
                    ->where('student_skill_points.id_student', '=', $studentId);
            })
                ->select(
                    'skills.*',
                    'student_skill_points.point as current_point'
                );
        }])
            ->select('categories.*')
            ->get()
            ->map(function ($category) {
                $totalPoints = $category->skills->sum('current_point');

                $skills = $category->skills->map(function ($skill) {
                    return [
                        'id_skill' => $skill->id_skill,
                        'name' => $skill->name,
                        'point' => $skill->current_point ?? 0
                    ];
                });

                return [
                    'id_category' => $category->id_category,
                    'name' => $category->name,
                    'total_points' => $totalPoints,
                    'skills' => $skills
                ];
            });

        $overallTotal = $categories->sum('total_points');

        return [
            'total_points' => $overallTotal,
            'categories' => $categories
        ];
    }

    public function addCompletionPoints(CourseEnrollment $enrollment)
    {
        $courseLevel = $enrollment->courseBatch->course->courseLevels;
        $points = $courseLevel->point_course_completion;

        $materialsSkills = $enrollment->courseBatch->course->materials->flatMap->skills;
        $quizzesSkills = $enrollment->courseBatch->course->quizzes->flatMap->skills;
        $assignmentsSkills = $enrollment->courseBatch->course->assignments->flatMap->skills;

        $allSkills = $materialsSkills->merge($quizzesSkills)->merge($assignmentsSkills)->unique('id_skill');

        DB::transaction(function () use ($enrollment, $points, $allSkills) {
            foreach ($allSkills as $skill) {
                PointHistory::create([
                    'id_student' => $enrollment->id_student,
                    'id_course_enrollment' => $enrollment->id_course_enrollment,
                    'id_skill' => $skill->id_skill,
                    'source_id' => $enrollment->id_course_enrollment,
                    'source_type' => PointHistory::SOURCE_TYPE['COURSE_COMPLETION'],
                    'point' => $points,
                ]);

                StudentSkillPoint::updateOrCreate(
                    [
                        'id_student' => $enrollment->id_student,
                        'id_skill' => $skill->id_skill,
                    ],
                    [
                        'point' => DB::raw('point + ' . $points),
                    ]
                );
            }
        });
    }
}
