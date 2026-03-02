<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TeacherReview extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teacher_review';
    protected $primaryKey = 'id_teacher_review';

    protected $fillable = [
        'id_student',
        'id_teacher',
        'rating',
        'content',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'id_teacher');
    }
}
