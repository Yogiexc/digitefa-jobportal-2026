<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class File extends Model
{
    use HasFactory, HasUuids;

    public function courseContent()
    {
        return $this->belongsTo(CourseContent::class, 'id_course_content', 'id_course_content');
    }
}
