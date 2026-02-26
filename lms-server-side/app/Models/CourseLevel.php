<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseLevel extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_levels';
    protected $primaryKey = 'id_course_level';

    protected $fillable = [
        'name',
        'point_course_material',
        'point_assignment',
        'point_quiz',
        'point_course_completion',
        'certificate',
    ];

    public function teacherLevels()
    {
        return $this->belongsToMany(
            TeacherLevel::class,
            'teacher_level_course_level',
            'id_course_level',
            'id_teacher_level'
        );
    }
}
