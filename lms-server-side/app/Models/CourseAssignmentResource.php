<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class CourseAssignmentResource extends Model
{
    use HasFactory, HasUuids;

    public function courseAssignment()
    {
        return $this->belongsTo(CourseAssignment::class, 'id_course_assignment', 'id_course_assignment');
    }
}
