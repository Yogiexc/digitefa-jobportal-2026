<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TeacherLevel extends Model
{
    use HasFactory;

    protected $table = 'teacher_levels';
    protected $primaryKey = 'id_teacher_level';

    protected $fillable = [
        'name',
        'description',
        'max_course'
    ];

    public function allowedCourseLevels()
    {
        return $this->belongsToMany(
            CourseLevel::class,
            'teacher_level_course_level',
            'id_teacher_level',
            'id_course_level'
        );
    }

}
