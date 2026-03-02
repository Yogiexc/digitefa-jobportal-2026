<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'social_links';
    protected $primaryKey = 'id_social_link';

    protected $fillable = [
        'id_teacher',
        'name',
        'link',
    ];

    public function teacher()
    {
        return $this->belongsTo(Course::class, 'id_teacher');
    }
}
