<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'students';
    protected $primaryKey = 'id_student';

    protected $fillable = [
        'id_user',
        'phone',
        'address',
        'date_of_birth',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function coursesTaken()
    {
        return $this->hasMany(CourseEnrollment::class, 'id_student');
    }

    public function reviews()
    {
        return $this->hasMany(CourseReview::class, 'id_student');
    }

    public function testimonies()
    {
        return $this->hasMany(Testimony::class, 'id_student');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'id_student');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class, 'id_student');
    }

    public function progress()
    {
        return $this->hasMany(StudentProgress::class, 'id_student');
    }
}
