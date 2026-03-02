<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CourseRule extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_rules';
    protected $primaryKey = 'id_course_rule';

    protected $fillable = [
        'id_course',
        'title',
        'description',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'id_course');
    }
}
