<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseMaterial extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_materials';
    protected $primaryKey = 'id_course_material';

    protected $fillable = [
        'id_course_section',
        'title',
        'description',
        'video_link',
    ];

    public function courseSection()
    {
        return $this->belongsTo(CourseSection::class, 'id_course_section');
    }

    public function tools()
    {
        return $this->hasMany(Tool::class, 'id_course_material');
    }

    public function resources()
    {
        return $this->hasMany(CourseMaterialResource::class, 'id_course_material');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'course_material_skills', 'id_course_material', 'id_skill');
    }
}
