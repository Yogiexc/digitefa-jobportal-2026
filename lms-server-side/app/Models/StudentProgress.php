<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentProgress extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'student_progress';
    protected $primaryKey = 'id_student_progress';

    protected $fillable = [
        'id_course_enrollment',
        'id_course_material',
    ];

    public function courseEnrollment()
    {
        return $this->belongsTo(CourseEnrollment::class, 'id_course_enrollment', 'id_course_enrollment');
    }

    public function courseMaterial()
    {
        return $this->belongsTo(CourseMaterial::class, 'id_course_material', 'id_course_material');
    }
}
