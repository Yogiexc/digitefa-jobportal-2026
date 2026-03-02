<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseSection extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_sections';
    protected $primaryKey = 'id_course_section';

    protected $fillable = [
        'id_course',
        'title',
        'description',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'id_course');
    }

    public function materials()
    {
        return $this->hasMany(CourseMaterial::class, 'id_course_section');
    }

    public function assignments()
    {
        return $this->hasMany(CourseAssignment::class, 'id_course_section');
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class, 'id_course_section');
    }
}
