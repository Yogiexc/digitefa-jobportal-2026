<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TeacherUpdateCategory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'teacher_update_categories';
    protected $primaryKey = 'id_teacher_update_category';

    protected $fillable = [
        'id_teacher_update_request',
        'id_category',
    ];

    public function updateRequest()
    {
        return $this->belongsTo(TeacherUpdateRequest::class, 'id_teacher_update_request', 'id_teacher_update_request');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_category', 'id_category');
    }
}
