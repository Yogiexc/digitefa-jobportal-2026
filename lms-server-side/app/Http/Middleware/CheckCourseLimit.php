<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class CheckCourseLimit
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return $next($request);
        }

        if ($user->role === 'teacher') {
            $teacher = Teacher::where('id_user', $user->id_user)->firstOrFail();
            $currentCourseCount = Course::where('id_teacher', $teacher->id_teacher)->count();
            $maxCourseLimit = $teacher->teacherLevel->max_course;

            if ($currentCourseCount >= $maxCourseLimit) {
                return response()->json([
                    'success' => false,
                    'status_code' => 403,
                    'message' => 'You have reached the maximum number of courses you can create.',
                ], 403);
            }
        }

        return $next($request);
    }
}
