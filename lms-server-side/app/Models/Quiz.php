<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Quiz extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quizzes';
    protected $primaryKey = 'id_quiz';

    protected $fillable = [
        'id_course_section',
        'title',
        'description',
        'duration',
        'max_attempt',
    ];

    public function courseSection()
    {
        return $this->belongsTo(CourseSection::class, 'id_course_section');
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class, 'id_quiz');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'quiz_skills', 'id_quiz', 'id_skill');
    }

    public function resources()
    {
        return $this->hasMany(QuizResource::class, 'id_quiz');
    }
}
