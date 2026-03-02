<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CourseBatch extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_batches';
    protected $primaryKey = 'id_course_batch';

    protected $fillable = [
        'capacity',
        'id_course',
        'start_date',
        'end_date',
        'status',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'id_course');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class, 'id_course_batch');
    }

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($courseBatch) {
    //         $courseBatch->status = $courseBatch->determineStatus();
    //     });

    //     static::updating(function ($courseBatch) {
    //         $courseBatch->status = $courseBatch->determineStatus();
    //     });
    // }

    public function determineStatus()
    {
        $today = now();

        if ($today->isBefore($this->start_date)) {
            return 'closed';
        }

        if ($today->isAfter($this->end_date)) {
            return 'closed';
        }

        return 'open';
    }
}
