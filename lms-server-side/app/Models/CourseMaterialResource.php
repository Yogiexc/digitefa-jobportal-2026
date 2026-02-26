<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class CourseMaterialResource extends Model
{
    use HasFactory, HasUuids;

    public function courseMaterial()
    {
        return $this->belongsTo(CourseMaterial::class, 'id_course_material', 'id_course_material');
    }
}
