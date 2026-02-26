<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class StudentSkillPoint extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'student_skill_points';
    protected $primaryKey = 'id_student_skill_point';

    protected $fillable = [
        'id_student',
        'id_skill',
        'point'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'id_skill');
    }
}
