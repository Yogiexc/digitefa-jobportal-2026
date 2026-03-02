<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuizQuestionResource extends Model
{
    use HasFactory, HasUuids;

    public function question()
    {
        return $this->belongsTo(Quiz::class, 'id_quiz_question', 'id_quiz_question');
    }
}
