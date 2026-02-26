<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\Course;
use Exception;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all();
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($id, 'id_user')],
            'name' => 'nullable|string',
        ]);

        $user = User::findOrFail($id);

        if ($request->has('email')) {
            $user->email = $validatedData['email'];
        }
        if ($request->has('name')) {
            $user->name = $validatedData['name'];
        }

        $user->save();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'User updated successfully',
            'user' => $user,
        ], 200);
    }

    public function changeEmail(Request $request, $id)
    {
        $validatedData = $request->validate([
            'email' => ['required', 'email', Rule::unique('users')],
        ]);
        $user = User::findOrFail($id);
        $user->update($validatedData);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'User updated successfully',
            'user' => $user,
        ], 200);
    }

    public function show($id)
    {
        $user = User::findOrFail($id)->load(['student', 'teacher.teacherLevel.allowedCourseLevels', 'teacher.categoriesTeacher', 'teacher.teacherCertificates',]);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'user' => $user,
        ], 200);
    }

    public function destroy($id_user)
    {
        try {
            DB::beginTransaction();

            $user = User::find($id_user);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'status_code' => 404,
                    'message' => 'User not found.',
                ], 404);
            }

            if ($user->role === 'student') {
                Student::where('id_user', $id_user)->delete();
            } elseif ($user->role === 'teacher') {
                Teacher::where('id_user', $id_user)->delete();
            }

            $user->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'User and related data successfully deleted.',
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Failed to delete user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTeachers()
    {
        $teachers = User::where('role', 'teacher')
            ->with(['teacher.teacherLevel.allowedCourseLevels', 'teacher.categoriesTeacher'])
            ->get();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'teachers' => $teachers,
        ], 200);
    }
    public function getStudents()
    {
        $students = User::where('role', 'student')
            ->with('student')
            ->get();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'students' => $students,
        ], 200);
    }

    public function getStatisticsAdminPage()
    {
        try {
            $monthlyStats = DB::table('courses')
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', date('Y'))
                ->groupBy('month')
                ->get();

            $monthlyTeachers = DB::table('teachers')
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', date('Y'))
                ->groupBy('month')
                ->get();

            $monthlyStudents = DB::table('students')
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', date('Y'))
                ->groupBy('month')
                ->get();

            $coursesByMonth = array_fill(0, 12, 0);
            $teachersByMonth = array_fill(0, 12, 0);
            $studentsByMonth = array_fill(0, 12, 0);

            foreach ($monthlyStats as $stat) {
                $coursesByMonth[$stat->month - 1] = $stat->count;
            }
            foreach ($monthlyTeachers as $stat) {
                $teachersByMonth[$stat->month - 1] = $stat->count;
            }
            foreach ($monthlyStudents as $stat) {
                $studentsByMonth[$stat->month - 1] = $stat->count;
            }

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'data' => [
                    'total_students' => Student::count(),
                    'total_teachers' => Teacher::count(),
                    'total_courses' => Course::count(),
                    'monthly_data' => [
                        'courses' => array_values($coursesByMonth),
                        'teachers' => array_values($teachersByMonth),
                        'students' => array_values($studentsByMonth)
                    ]
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Error fetching statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}
