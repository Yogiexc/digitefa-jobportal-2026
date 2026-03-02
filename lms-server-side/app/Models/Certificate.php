<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'certificates';
    protected $primaryKey = 'id_certificate';

    protected $fillable = [
        'id_course',
        'id_student',
        'title',
        'description',
        'file',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'id_course');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }
}
