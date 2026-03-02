<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'skills';
    protected $primaryKey = 'id_skill';

    protected $fillable = [
        'id_category',
        'name',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_category');
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_skill', 'id_skill', 'id_course');
    }
}
