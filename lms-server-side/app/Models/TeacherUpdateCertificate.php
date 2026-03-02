<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherUpdateCertificate extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teacher_update_certificates';
    protected $primaryKey = 'id_request_certificate';

    protected $fillable = [
        'id_teacher_update_request',
        'file',
        'name',
    ];

    public function updateRequest()
    {
        return $this->belongsTo(TeacherUpdateRequest::class, 'id_teacher_update_request', 'id_teacher_update_request');
    }
}
