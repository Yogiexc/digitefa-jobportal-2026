<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\QuizSubmission;
use App\Models\QuizSubmissionAnswer;
use App\Models\CourseEnrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Jobs\AutoSubmitQuiz;

class QuizSubmissionController extends Controller
{
    public function start(Request $request)
    {
        $validated = $request->validate([
            'id_quiz' => 'required|exists:quizzes,id_quiz',
            'id_course_enrollment' => 'required|exists:course_enrollments,id_course_enrollment'
        ]);

        $quiz = Quiz::findOrFail($validated['id_quiz']);
        $enrollment = CourseEnrollment::findOrFail($validated['id_course_enrollment']);

        $attemptCount = QuizSubmission::where('id_quiz', $quiz->id_quiz)
            ->where('id_course_enrollment', $enrollment->id_course_enrollment)
            ->count();

        if ($attemptCount >= $quiz->max_attempt) {
            return response()->json([
                'message' => 'Maximum attempt limit reached'
            ], 403);
        }

        $submission = QuizSubmission::create([
            'id_quiz' => $quiz->id_quiz,
            'id_course_enrollment' => $enrollment->id_course_enrollment,
            'started_at' => now(),
            'status' => 'started',
            'attempt_number' => $attemptCount + 1
        ]);

        $this->scheduleAutoSubmit($submission, $quiz->duration);

        return response()->json([
            'message' => 'Quiz started successfully',
            'submission' => $submission,
            'remaining_time' => $quiz->duration * 60
        ]);
    }

    public function submit(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_quiz_submission' => 'required'
            ]);

            return DB::transaction(function () use ($validated) {
                $submission = QuizSubmission::with(['answers', 'quiz.questions.options'])
                    ->findOrFail($validated['id_quiz_submission']);

                if ($submission->status === 'completed') {
                    return response()->json(['message' => 'Quiz already submitted'], 403);
                }

                $grade = $this->calculateGrade($submission->quiz, $submission->answers);

                $submission->update([
                    'status' => 'completed',
                    'submitted_at' => now(),
                    'grade' => $grade
                ]);

                return response()->json([
                    'message' => 'Quiz submitted successfully',
                    'grade' => $grade,
                    'submission' => $submission->fresh(['answers', 'quiz.questions.options'])
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Quiz submit error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to submit quiz'], 500);
        }
    }

    public function calculateGrade($quiz, $answers)
    {
        $correctAnswers = 0;
        $totalQuestions = $quiz->questions->count();
        $essayQuestions = 0;
        $pendingEssays = false;

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
            } elseif ($question->type === 'essay') {
                $answer = $answers->where('id_quiz_question', $question->id_quiz_question)->first();
                $essayQuestions++;

                if ($answer) {
                    if ($answer->is_correct === null) {
                        $pendingEssays = true;
                    } elseif ($answer->is_correct) {
                        $correctAnswers++;
                    }
                }
            }
        }

        if ($pendingEssays) {
            return null;
        }

        $gradedQuestions = $totalQuestions - ($essayQuestions * (int)$pendingEssays);

        if ($gradedQuestions > 0) {
            return round(($correctAnswers / $gradedQuestions) * 100);
        }

        return null;
    }

    public function updateGrade(Request $request, $id_quiz_submission)
    {
        $submission = QuizSubmission::findOrFail($id_quiz_submission);

        if ($submission->status !== 'completed') {
            return response()->json(['message' => 'Quiz is not yet completed'], 403);
        }

        $grade = $this->calculateGrade($submission->quiz, $submission->answers);

        $submission->update([
            'grade' => $grade
        ]);

        return response()->json([
            'grade' => $grade,
            'submission' => $submission->only(['id_quiz_submission', 'id_course_enrollment', 'attempt_number', 'started_at', 'submitted_at'])
        ]);
    }

    protected function scheduleAutoSubmit($submission, $duration)
    {
        AutoSubmitQuiz::dispatch($submission)
            ->delay(now()->addMinutes($duration));
    }

    public function getRemainingTime($id_quiz_submission)
    {
        $submission = QuizSubmission::with('quiz')->findOrFail($id_quiz_submission);
        $endTime = Carbon::parse($submission->started_at)->addMinutes($submission->quiz->duration);

        if (now()->gt($endTime)) {
            return response()->json(['remaining_time' => 0]);
        }

        return response()->json([
            'remaining_time' => now()->diffInSeconds($endTime)
        ]);
    }

    public function getAttempts($id_quiz, $id_course_enrollment)
    {
        $attempts = QuizSubmission::where('id_quiz', $id_quiz)
            ->where('id_course_enrollment', $id_course_enrollment)
            ->orderBy('attempt_number', 'desc')
            ->get();

        $quiz = Quiz::find($id_quiz);
        $max_attempt = $quiz ? $quiz->max_attempt : 0;

        return response()->json([
            'quiz' => $quiz,
            'attempts' => $attempts,
            'highest_grade' => $attempts->max('grade') ?? 0,
            'total_attempts' => $attempts->count(),
            'max_attempt' => $max_attempt,
        ]);
    }

    public function resumeQuiz($id_quiz_submission)
    {
        $submission = QuizSubmission::with([
            'quiz',
            'answers.questions',
            'quiz.questions.options'
        ])->findOrFail($id_quiz_submission);

        if ($submission->status === 'completed') {
            return response()->json(['message' => 'Quiz already completed'], 403);
        }

        $endTime = Carbon::parse($submission->started_at)
            ->addMinutes($submission->quiz->duration);

        if (now()->gt($endTime)) {
            $this->submit(new Request(['id_quiz_submission' => $submission->id_quiz_submission]));
            return response()->json(['message' => 'Quiz time has expired'], 403);
        }

        return response()->json([
            'submission' => $submission,
            'remaining_time' => now()->diffInSeconds($endTime)
        ]);
    }

    public function getSubmissions($id_quiz)
    {
        $submissions = QuizSubmission::where('id_quiz', $id_quiz)
            ->with([
                'courseEnrollment.user',
                'answers.questions'
            ])
            ->get()
            ->groupBy('id_course_enrollment')
            ->map(function ($userSubmissions) {
                return [
                    'attempts' => $userSubmissions,
                    'highest_grade' => $userSubmissions->max('grade'),
                    'latest_attempt' => $userSubmissions->sortByDesc('attempt_number')->first()
                ];
            });

        return response()->json(['submissions' => $submissions]);
    }

    protected function autoSubmitExpiredQuizzes()
    {
        $expiredSubmissions = QuizSubmission::with('quiz')
            ->where('status', 'started')
            ->get()
            ->filter(function ($submission) {
                $endTime = Carbon::parse($submission->started_at)
                    ->addMinutes($submission->quiz->duration);
                return now()->gt($endTime);
            });

        foreach ($expiredSubmissions as $submission) {
            $this->submit(new Request(['id_quiz_submission' => $submission->id_quiz_submission]));
        }
    }

    public function getPendingEssays($id_quiz)
    {
        $pendingEssays = QuizSubmissionAnswer::whereHas('questions', function ($query) {
            $query->where('type', 'essay');
        })
            ->whereNull('graded_at')
            ->whereHas('quizSubmission', function ($query) use ($id_quiz) {
                $query->where('id_quiz', $id_quiz)
                    ->where('status', 'completed');
            })
            ->with(['quizSubmission.courseEnrollment.user', 'questions'])
            ->get();

        return response()->json(['pending_essays' => $pendingEssays]);
    }

    public function viewSubmission($id_quiz_submission)
    {
        $submission = QuizSubmission::with(['quiz.questions.options'])
            ->findOrFail($id_quiz_submission);

        $answers = $submission->answers->map(function ($answer) {
            return [
                'id_quiz_submission_answer' => $answer->id_quiz_submission_answerd,
                'id_quiz_submission' => $answer->id_quiz_submission,
                'id_quiz_question' => $answer->id_quiz_question,
                'answer' => $answer->answer,
                'is_correct' => $answer->is_correct,
            ];
        });

        return response()->json([
            'submission' => $submission,
        ]);
    }

    public function viewSubmissionSimple($id_quiz_submission)
    {
        $submission = QuizSubmission::with(['answers.questions.options', 'quiz.questions.options'])
            ->findOrFail($id_quiz_submission);

        return response()->json([
            'submission' => $submission,
        ]);
    }

    public function checkStudentQuizInProgress($id_course_enrollment, $id_quiz)
    {
        $inProgressQuiz = QuizSubmission::where('id_course_enrollment', $id_course_enrollment)
            ->where('id_quiz', $id_quiz)
            ->where('status', 'started')
            ->first();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'in_progress' => $inProgressQuiz ? true : false,
            'id_quiz_submission' => $inProgressQuiz ? $inProgressQuiz->id_quiz_submission : null,
        ], 200);
    }
}
