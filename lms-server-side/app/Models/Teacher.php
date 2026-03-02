<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teachers';
    protected $primaryKey = 'id_teacher';

    protected $fillable = [
        'id_user',
        'id_teacher_level',
        'address',
        'bio',
        'date_of_birth',
        'education',
        'phone_number',
        'year_of_experience',
        'image',
        'portofolio',
        'identity',
        'certificate',
        'status',
        'note',
        'affiliation',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'id_teacher');
    }

    public function reviews()
    {
        return $this->hasMany(TeacherReview::class, 'id_teacher');
    }

    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class, 'id_teacher');
    }

    public function courseLevels()
    {
        return $this->belongsToMany(CourseLevel::class, 'teacher_level_course_level', 'id_teacher_level', 'id_course_level');
    }

    public function teacherLevel()
    {
        return $this->belongsTo(TeacherLevel::class, 'id_teacher_level');
    }

    public function categoriesTeacher()
    {
        return $this->belongsToMany(
            Category::class,
            'teachers_categories',
            'id_teacher',
            'id_category'
        );
    }

    public function allowedCourseLevels()
    {
        return $this->belongsToMany(
            CourseLevel::class,
            'teacher_level_course_level',
            'id_teacher_level',
            'id_course_level'
        );
    }


    public function teacherCertificates()
    {
        return $this->hasMany(TeacherCertificate::class, 'id_teacher');
    }
}
