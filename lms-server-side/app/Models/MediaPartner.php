<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MediaPartner extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'media_partners';
    protected $primaryKey = 'id_media_partner';

    protected $fillable = [
        'name',
        'image',
    ];
}
