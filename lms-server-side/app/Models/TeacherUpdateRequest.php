<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherUpdateRequest extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teacher_update_requests';
    protected $primaryKey = 'id_teacher_update_request';

    protected $fillable = [
        'type',
        'id_teacher',
        'email',
        'name',
        'address',
        'bio',
        'date_of_birth',
        'education',
        'phone_number',
        'year_of_experience',
        'photo_profile',
        'portofolio',
        'identity',
        'status',
        'note',
        'affiliation',
    ];

    public function certificates()
    {
        return $this->hasMany(TeacherUpdateCertificate::class, 'id_teacher_update_request', 'id_teacher_update_request');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'teacher_update_categories', 'id_teacher_update_request', 'id_category');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'id_teacher', 'id_teacher');
    }
}
