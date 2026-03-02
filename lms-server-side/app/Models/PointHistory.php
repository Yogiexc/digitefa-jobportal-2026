<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PointHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'point_histories';
    protected $primaryKey = 'id_point_history';

    protected $fillable = [
        'id_student',
        'id_course_enrollment',
        'id_skill',
        'source_id',
        'source_type',
        'point'
    ];

    const SOURCE_TYPE = [
        'COURSE_MATERIAL' => 'course_material',
        'COURSE_ASSIGNMENT' => 'course_assignment',
        'QUIZ' => 'quiz',
        'COURSE_COMPLETION' => 'course_completion',
        'SKILL_POINT' => 'skill_point',
        'ASSIGNMENT_SUBMISSION' => 'assignment_submission',
        'QUIZ_SUBMISSION' => 'quiz_submission'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }

    public function courseEnrollment()
    {
        return $this->belongsTo(CourseEnrollment::class, 'id_course_enrollment');
    }
}
