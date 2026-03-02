<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuizSubmission;
use App\Models\Quiz;
use App\Models\CourseEnrollment;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class QuizScoreController extends Controller
{
    public function getAllQuizScores()
    {
        $submissions = QuizSubmission::with(['quiz', 'courseEnrollment.student.user'])
            ->get()
            ->map(function ($submission) {
                return [
                    'student_name' => $submission->courseEnrollment->student->user->name,
                    'quiz_title' => $submission->quiz->title,
                    'grade' => $submission->grade,
                    'status' => $submission->status,
                    'started_at' => $submission->started_at,
                    'submitted_at' => $submission->submitted_at,
                    'duration_taken' => $submission->submitted_at
                        ? Carbon::parse($submission->started_at)->diffInMinutes($submission->submitted_at)
                        : null,
                ];
            });

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'scores' => $submissions,
        ]);
    }

    public function getQuizAttemptHistory($id_course_enrollment, $id_quiz)
    {
        $quiz = Quiz::findOrFail($id_quiz);
        $enrollment = CourseEnrollment::findOrFail($id_course_enrollment);

        $attempts = QuizSubmission::where('id_course_enrollment', $id_course_enrollment)
            ->where('id_quiz', $id_quiz)
            ->with(['quiz_submission_answers.quiz_question', 'quiz_submission_answers.quiz_option'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($attempt) {
                return [
                    'id_quiz_submission' => $attempt->id_quiz_submission,
                    'grade' => $attempt->grade,
                    'status' => $attempt->status,
                    'started_at' => $attempt->started_at,
                    'submitted_at' => $attempt->submitted_at,
                    'duration_taken' => $attempt->submitted_at
                        ? Carbon::parse($attempt->started_at)->diffInMinutes($attempt->submitted_at)
                        : null,
                    'answers_count' => $attempt->quiz_submission_answers->count(),
                    'correct_answers' => $attempt->quiz_submission_answers
                        ->where('is_correct', true)->count()
                ];
            });

        $attemptsLeft = $quiz->max_retake - $attempts->count();

        $highestScore = $attempts->max('grade');

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'quiz_info' => [
                'title' => $quiz->title,
                'duration' => $quiz->duration,
                'max_retake' => $quiz->max_retake
            ],
            'attempts' => $attempts,
            'attempts_left' => max(0, $attemptsLeft),
            'highest_score' => $highestScore,
            'total_attempts' => $attempts->count()
        ]);
    }

    public function getQuizDetailsWithAnswers($id_quiz_submission)
    {
        $submission = QuizSubmission::with([
            'quiz_submission_answers.quiz_question',
            'quiz_submission_answers.quiz_option',
            'quiz.questions.options'
        ])->findOrFail($id_quiz_submission);

        $answersAnalysis = [];
        foreach ($submission->quiz_submission_answers as $answer) {
            $answersAnalysis[] = [
                'question' => $answer->quiz_question->question,
                'type' => $answer->quiz_question->type,
                'student_answer' => $answer->answer,
                'selected_option' => $answer->quiz_option ? $answer->quiz_option->answer : null,
                'is_correct' => $answer->is_correct,
                'correct_answer' => $answer->quiz_question->type !== 'essay'
                    ? $answer->quiz_question->options->where('is_correct', true)->pluck('answer')
                    : null
            ];
        }

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'submission' => [
                'grade' => $submission->grade,
                'status' => $submission->status,
                'started_at' => $submission->started_at,
                'submitted_at' => $submission->submitted_at,
                'duration_taken' => Carbon::parse($submission->started_at)
                    ->diffInMinutes($submission->submitted_at)
            ],
            'answers_analysis' => $answersAnalysis
        ]);
    }
}
