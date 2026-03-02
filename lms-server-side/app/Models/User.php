<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, HasUuids;

    protected $table = 'users';
    protected $primaryKey = 'id_user';
    protected $hidden = ['password'];

    protected $fillable = [
        'email',
        'name',
        'password',
        'role',
        'is_verified',
        'job_portal_id',
        'job_portal_linked_at',
    ];

    public function student()
    {
        return $this->hasOne(Student::class, 'id_user');
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class, 'id_user');
    }
}
