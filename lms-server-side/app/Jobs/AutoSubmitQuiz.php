<?php

namespace App\Jobs;

use App\Http\Controllers\QuizSubmissionController;
use App\Models\QuizSubmission;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AutoSubmitQuiz implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $submission;
    public $tries = 3;
    public $timeout = 120;

    public function __construct(QuizSubmission $submission)
    {
        $this->submission = $submission;
    }

    public function handle(): void
    {
        try {
            if ($this->shouldSubmit()) {
                (new QuizSubmissionController)->submit(
                    new Request(['id_quiz_submission' => $this->submission->id_quiz_submission])
                );

                Log::info('Quiz auto-submitted', [
                    'id_quiz_submission' => $this->submission->id_quiz_submission
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Auto-submit failed', [
                'id_quiz_submission' => $this->submission->id_quiz_submission,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function shouldSubmit(): bool
    {
        $submission = $this->submission->fresh();

        if ($submission->status === 'completed') {
            return false;
        }

        $endTime = Carbon::parse($submission->started_at)
            ->addMinutes($submission->quiz->duration);

        return now()->gte($endTime);
    }

    public function retryUntil()
    {
        return now()->addMinutes(5);
    }
}
