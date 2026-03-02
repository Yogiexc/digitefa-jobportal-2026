<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'categories';
    protected $primaryKey = 'id_category';

    protected $fillable = [
        'name',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class, 'id_category');
    }

    public function skills()
    {
        return $this->hasMany(Skill::class, 'id_category');
    }
}
