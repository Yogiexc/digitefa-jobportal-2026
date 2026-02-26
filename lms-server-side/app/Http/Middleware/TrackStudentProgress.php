<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\StudentProgress;
use App\Models\CourseEnrollment;

class TrackStudentProgress
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $studentId = DB::table('students')->where('id_user', $user->id_user)->value('id_student');
        if (!$studentId) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $courseMaterialId = $request->route('id');

        $courseEnrollment = CourseEnrollment::where('id_student', $studentId)
            ->where('status', 'enrolled')
            ->first();

        if (!$courseEnrollment) {
            return response()->json(['message' => 'No active course enrollment found'], 404);
        }

        $progressExists = StudentProgress::where('id_course_enrollment', $courseEnrollment->id_course_enrollment)
            ->where('id_course_material', $courseMaterialId)
            ->exists();

        if (!$progressExists) {
            StudentProgress::create([
                'id_student_progress' => Str::uuid(),
                'id_course_enrollment' => $courseEnrollment->id_course_enrollment,
                'id_course_material' => $courseMaterialId,
            ]);
        }

        return $next($request);
    }
}
