<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'faqs';
    protected $primaryKey = 'id_faq';

    protected $fillable = [
        'title',
        'answer',
    ];
}
