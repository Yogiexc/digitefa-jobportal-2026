<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AssignmentSubmissionResource extends Model
{
    use HasFactory, HasUuids;

    public function assignmentSubmission()
    {
        return $this->belongsTo(AssignmentSubmission::class, 'id_assignment_submission');
    }
}
