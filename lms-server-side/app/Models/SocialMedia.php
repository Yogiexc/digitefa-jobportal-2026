<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SocialMedia extends Model
{
    use HasFactory;

    protected $table = 'social_media';
    protected $primaryKey = 'id_social_media';

    protected $fillable = [
        'phone_number',
        'tiktok',
        'instagram',
        'x',
        'youtube',
        'linkedin',
    ];
}
