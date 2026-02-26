<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'courses';
    protected $primaryKey = 'id_course';

    protected $fillable = [
        'id_category',
        'id_teacher',
        'id_course_level',
        'title',
        'thumbnail',
        'thumbnail_link',
        'description',
        'rules',
        'duration',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'id_teacher');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_category');
    }

    public function sections()
    {
        return $this->hasMany(CourseSection::class, 'id_course');
    }

    public function rules()
    {
        return $this->hasMany(CourseRule::class, 'id_course_rule');
    }

    public function students()
    {
        return $this->hasMany(CourseEnrollment::class, 'id_course');
    }

    public function reviews()
    {
        return $this->hasMany(CourseReview::class, 'id_course');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'id_course');
    }

    public function teacherLevels()
    {
        return $this->belongsToMany(TeacherLevel::class, 'teacher_level_course_level', 'id_course_level', 'id_teacher_level');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'skills', 'id_course', 'id_skill');
    }

    public function courseLevels()
    {
        return $this->belongsTo(CourseLevel::class, 'id_course_level');
    }

    public function tools()
    {
        return $this->belongsToMany(Tool::class, 'course_tools', 'id_course', 'id_tool');
    }

    public function batches()
    {
        return $this->hasMany(CourseBatch::class, 'id_course');
    }

    public function materials()
    {
        return $this->hasManyThrough(CourseMaterial::class, CourseSection::class, 'id_course', 'id_course_section', 'id_course', 'id_course_section');
    }

    public function assignments()
    {
        return $this->hasManyThrough(CourseAssignment::class, CourseSection::class, 'id_course', 'id_course_section', 'id_course', 'id_course_section');
    }

    public function quizzes()
    {
        return $this->hasManyThrough(Quiz::class, CourseSection::class, 'id_course', 'id_course_section', 'id_course', 'id_course_section');
    }
}
