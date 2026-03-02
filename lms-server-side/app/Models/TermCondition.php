<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TermCondition extends Model
{
    use HasFactory;

    protected $table = 'terms_conditions';
    protected $primaryKey = 'id_term_condition';

    protected $fillable = [
        'content',
    ];
}
