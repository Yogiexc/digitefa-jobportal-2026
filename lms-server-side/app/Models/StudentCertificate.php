<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentCertificate extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'student_certificates';
    protected $primaryKey = 'id_student_certificate';

    protected $fillable = [
        'id_course_enrollment',
        'file',
    ];

    public function courseEnrollment()
    {
        return $this->belongsTo(CourseEnrollment::class, 'id_course_enrollment');
    }
}
