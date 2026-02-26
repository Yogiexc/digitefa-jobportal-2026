<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherCertificate extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teachers_certificates';
    protected $primaryKey = 'id_teacher_certificate';

    protected $fillable = [
        'id_teacher',
        'name',
        'file',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'id_teacher', 'id_teacher');
    }
}
