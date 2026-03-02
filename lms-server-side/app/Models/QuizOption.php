<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Auth;

class QuizOption extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'quiz_options';
    protected $primaryKey = 'id_quiz_option';

    protected $fillable = [
        'id_quiz_question',
        'answer',
        'reference_answer',
        'is_correct',
    ];

    protected $hidden = ['is_correct','reference_answer'];

    protected static function booted()
    {
        static::retrieved(function ($model) {
            $user = Auth::user();
            if ($user && in_array($user->role, ['admin', 'teacher'])) {
                $model->makeVisible('is_correct','reference_answer');
            }
        });
    }

    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'id_quiz_question');
    }

    public function resources()
    {
        return $this->hasMany(QuizOptionResource::class, 'id_quiz_option');
    }
}
