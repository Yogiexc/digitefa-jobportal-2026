<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuizSubmissionAnswer extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quiz_submission_answers';
    protected $primaryKey = 'id_quiz_submission_answer';

    protected $fillable = [
        'id_quiz_submission',
        'id_quiz_question',
        'id_quiz_option',
        'answer',
        'is_correct',
    ];

    public function quizSubmission()
    {
        return $this->belongsTo(QuizSubmission::class, 'id_quiz_submission', 'id_quiz_submission');
    }

    public function questions()
    {
        return $this->belongsTo(QuizQuestion::class, 'id_quiz_question');
    }

    public function quizOption()
    {
        return $this->belongsTo(QuizOption::class, 'id_quiz_option');
    }
}
