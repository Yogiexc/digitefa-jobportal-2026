<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuizSubmission;
use App\Models\QuizSubmissionAnswer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class QuizSubmissionAnswerController extends Controller
{
    public function submitAnswer(Request $request)
    {
        $validated = $request->validate([
            'id_quiz_submission' => 'required|uuid|exists:quiz_submissions,id_quiz_submission',
            'answers' => 'required|array',
            'answers.*.id_quiz_question' => 'required|uuid|exists:quiz_questions,id_quiz_question',
            'answers.*.answers' => 'required|array',
        ]);

        return DB::transaction(function () use ($validated) {
            $submission = QuizSubmission::findOrFail($validated['id_quiz_submission']);

            if ($submission->status === 'completed') {
                return response()->json(['message' => 'Quiz already submitted'], 403);
            }

            $endTime = Carbon::parse($submission->started_at)
                ->addMinutes($submission->quiz->duration);

            if (now()->gt($endTime)) {
                return response()->json(['message' => 'Quiz time has expired'], 403);
            }

            $responses = [];

            foreach ($validated['answers'] as $answerData) {
                $question = $submission->quiz->questions()
                    ->where('id_quiz_question', $answerData['id_quiz_question'])
                    ->firstOrFail();

                // Delete existing answers for the question
                QuizSubmissionAnswer::where('id_quiz_submission', $submission->id_quiz_submission)
                    ->where('id_quiz_question', $answerData['id_quiz_question'])
                    ->delete();

                switch ($question->type) {
                    case 'single_choice':
                        $responses[] = $this->handleSingleChoice($submission, $question, $answerData['answers'][0]);
                        break;

                    case 'multiple_choice':
                        $responses[] = $this->handleMultipleChoice($submission, $question, $answerData['answers']);
                        break;

                    case 'essay':
                        $responses[] = $this->handleEssay($submission, $question, $answerData['answers'][0]);
                        break;
                }
            }

            return response()->json([
                'message' => 'Answers submitted successfully',
                'responses' => $responses
            ]);
        });
    }

    private function handleSingleChoice($submission, $question, $answerId)
    {
        $option = $question->options()->findOrFail($answerId);

        return QuizSubmissionAnswer::create([
            'id_quiz_submission' => $submission->id_quiz_submission,
            'id_quiz_question' => $question->id_quiz_question,
            'id_quiz_option' => $option->id_quiz_option,
            'answer' => null
        ]);
    }

    private function handleMultipleChoice($submission, $question, $answerIds)
    {
        $answers = [];

        foreach ($answerIds as $answerId) {
            $option = $question->options()->findOrFail($answerId);

            $answers[] = QuizSubmissionAnswer::create([
                'id_quiz_submission' => $submission->id_quiz_submission,
                'id_quiz_question' => $question->id_quiz_question,
                'id_quiz_option' => $option->id_quiz_option,
                'answer' => null
            ]);
        }

        return $answers;
    }

    private function handleEssay($submission, $question, $answerText)
    {
        $option = $question->options()->firstOrCreate(
            ['id_quiz_question' => $question->id_quiz_question],
            ['answer' => 'Essay Answer', 'is_correct' => null]
        );

        return QuizSubmissionAnswer::create([
            'id_quiz_submission' => $submission->id_quiz_submission,
            'id_quiz_question' => $question->id_quiz_question,
            'id_quiz_option' => $option->id_quiz_option,
            'answer' => $answerText,
            'is_correct' => null
        ]);
    }

    public function gradeEssayAnswer(Request $request)
    {
        $validated = $request->validate([
            'id_quiz_submission_answer' => 'required|exists:quiz_submission_answers,id_quiz_submission_answer',
            'is_correct' => 'required|boolean'
        ]);

        $answer = QuizSubmissionAnswer::findOrFail($validated['id_quiz_submission_answer']);

        if ($answer->questions->type !== 'essay') {
            return response()->json(['message' => 'Only essay answers can be graded manually'], 403);
        }

        $answer->update([
            'is_correct' => $validated['is_correct'],
            'graded_at' => now()
        ]);

        return response()->json([
            'message' => 'Essay answer graded successfully',
            'answer' => $answer
        ]);
    }
}
