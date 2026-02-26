<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseReview extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_reviews';
    protected $primaryKey = 'id_course_review';

    protected $fillable = [
        'id_student',
        'id_course',
        'rating',
        'content',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'id_course');
    }
}
