<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class QuizOptionResource extends Model
{
    use HasFactory, HasUuids;

    public function option()
    {
        return $this->belongsTo(QuizOption::class, 'id_quiz_option');
    }
}
