<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AssignmentSubmission extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'assignment_submissions';
    protected $primaryKey = 'id_assignment_submission';

    protected $fillable = [
        'id_course_enrollment',
        'id_course_assignment',
        'grade',
    ];

    public function courseEnrollment()
    {
        return $this->belongsTo(CourseEnrollment::class, 'id_course_enrollment');
    }

    public function courseAssignment()
    {
        return $this->belongsTo(CourseAssignment::class, 'id_course_assignment');
    }

    public function resources()
    {
        return $this->hasMany(AssignmentSubmissionResource::class, 'id_assignment_submission');
    }
}
