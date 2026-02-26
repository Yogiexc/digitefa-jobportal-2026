<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Testimony extends Model
{
    use HasFactory,HasUuids;

    protected $table = 'testimonies';
    protected $primaryKey = 'id_testimony';

    protected $fillable = [
        'id_student',
        'rating',
        'content',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }
}
