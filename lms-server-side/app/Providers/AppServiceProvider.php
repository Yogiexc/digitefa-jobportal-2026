<?php

namespace App\Providers;

use App\Models\StudentProgress;
use App\Models\AssignmentSubmission;
use App\Models\QuizSubmission;
use App\Observers\StudentProgressObserver;
use App\Observers\AssignmentSubmissionObserver;
use App\Observers\QuizSubmissionObserver;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
            $openApi->secure(
                SecurityScheme::http('bearer'),
            );
        });
        StudentProgress::observe(StudentProgressObserver::class);
        AssignmentSubmission::observe(AssignmentSubmissionObserver::class);
        QuizSubmission::observe(QuizSubmissionObserver::class);
    }
}
