<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuizQuestion extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quiz_questions';
    protected $primaryKey = 'id_quiz_question';

    protected $fillable = [
        'id_quiz',
        'question',
        'type',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'id_quiz');
    }

    public function options()
    {
        return $this->hasMany(QuizOption::class, 'id_quiz_question');
    }

    public function resources()
    {
        return $this->hasMany(QuizQuestionResource::class, 'id_quiz_question');
    }
}
