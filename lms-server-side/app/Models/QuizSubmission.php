<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuizSubmission extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quiz_submissions';
    protected $primaryKey = 'id_quiz_submission';

    protected $fillable = [
        'id_course_enrollment',
        'id_quiz',
        'started_at',
        'submitted_at',
        'status',
        'attempt_number',
        'grade',
    ];

    public function courseEnrollment()
    {
        return $this->belongsTo(CourseEnrollment::class, 'id_course_enrollment');
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'id_quiz');
    }

    public function answers()
    {
        return $this->hasMany(QuizSubmissionAnswer::class, 'id_quiz_submission');
    }
}
