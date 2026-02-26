<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseAssignment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_assignments';
    protected $primaryKey = 'id_course_assignment';

    protected $fillable = [
        'id_course_section',
        'title',
        'description',
    ];

    public function courseSection()
    {
        return $this->belongsTo(CourseSection::class, 'id_course_section');
    }

    public function resources()
    {
        return $this->hasMany(CourseAssignmentResource::class, 'id_course_assignment');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'course_assignment_skills', 'id_course_assignment', 'id_skill');
    }
}
