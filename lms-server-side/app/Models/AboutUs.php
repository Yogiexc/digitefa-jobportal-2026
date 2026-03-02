<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    use HasFactory;

    protected $table = 'about_us';
    protected $primaryKey = 'id_about_us';

    protected $fillable = [
        'title',
        'description',
        'image',
        'content',
    ];
}
