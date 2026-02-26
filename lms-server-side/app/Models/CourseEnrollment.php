<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseEnrollment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_enrollments';
    protected $primaryKey = 'id_course_enrollment';

    protected $fillable = [
        'id_course_batch',
        'id_student',
        'completed_at',
        'start_date',
        'end_date',
        'status',
    ];

    public function courseBatch()
    {
        return $this->belongsTo(CourseBatch::class, 'id_course_batch');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class, 'id_course_enrollment');
    }

    public function quizSubmissions()
    {
        return $this->hasMany(QuizSubmission::class, 'id_course_enrollment');
    }
}
