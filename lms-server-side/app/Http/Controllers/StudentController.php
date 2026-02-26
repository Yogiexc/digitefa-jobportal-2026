<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class StudentController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048', // Maksimal 2MB
        ]);
    }

    private function validateMethod(Request $request)
    {
        $method = $request->input('_method', 'PUT');
        if (!in_array(strtoupper($method), ['PUT', 'PATCH'])) {
            return response()->json(['error' => 'Metode HTTP tidak diizinkan'], 405);
        }
    }

    private function storeFile($file)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $uniqueFileName = $fileName . '_' . time() . '.' . $extension;

        $file->move('uploads/Student/Student Profile/', $uniqueFileName);
        return $uniqueFileName;
    }

    private function deleteOldFile($fileName)
    {
        $filePath = public_path('uploads/Student/Student Profile/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function update(Request $request, $id)
    {
        $this->validateMethod($request);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($id, 'id_user')],
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $student = Student::where('id_user', $id)->firstOrFail();
        $user = $student->user;

        if ($request->has('name')) {
            $user->name = $validated['name'] ?? $user->name;
        }
        if ($request->has('email')) {
            $user->email = $validated['email'] ?? $user->email;
        }
        $user->save();

        $student->phone = $validated['phone'] ?? $student->phone;
        $student->address = $validated['address'] ?? $student->address;
        $student->date_of_birth = $validated['date_of_birth'] ?? $student->date_of_birth;

        if ($request->hasFile('image')) {
            if ($student->image) {
                $this->deleteOldFile($student->image, 'uploads/Student/Student Profile/');
            }
            $student->image = $this->storeFile($request->file('image'));
        }

        $student->save();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Student data updated successfully',
            'student' => $student,
            'user' => $user,
        ], 200);
    }

    public function getCompletedCourses(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'student' || !$user->student) {
            return response()->json([
                'success' => false,
                'status_code' => 403,
                'message' => 'Unauthorized or student profile not found.',
            ], 403);
        }

        $student = $user->student;


        $completedEnrollments = $student->enrollments()
            ->whereNotNull('completed_at')
            ->with([
                'courseBatch.course' => function ($query) {
                }
            ])
            ->get();

        if ($completedEnrollments->isEmpty()) {
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'No completed courses found for this student.',
                'data' => [],
            ], 200);
        }

        $completedCourses = $completedEnrollments->map(function ($enrollment) {
            if ($enrollment->courseBatch && $enrollment->courseBatch->course) {
                $course = $enrollment->courseBatch->course;
                return $course;
            }
            return null; 
        })->filter()->values();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Successfully retrieved completed courses.',
            'data' => $completedCourses,
        ], 200);
    }

    public function getStudentCompletedCoursesById(Request $request, $lmsUserId)
    {
        $user = User::find($lmsUserId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'status_code' => 404,
                'message' => 'User not found with the provided ID.',
            ], 404);
        }

        if (!$user->student) {
            return response()->json([
                'success' => false,
                'status_code' => 404,
                'message' => 'Student profile not found for this user.',
            ], 404);
        }

        $student = $user->student;

        $completedEnrollments = $student->enrollments()
            ->whereNotNull('completed_at')
            ->with(['courseBatch.course.category']) 
            ->get();

        if ($completedEnrollments->isEmpty()) {
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'No completed courses found for this student.',
                'data' => [],
            ], 200);
        }

        $completedCourses = $completedEnrollments->map(function ($enrollment) {
            $course = optional($enrollment->courseBatch)->course;

            if ($course) {
                return [
                    'id_course' => $course->id_course,
                    'title' => $course->title,
                    'description' => $course->description,
                    'category' => $course->category ? $course->category->name : null,
                ];
            }

            return null;
        })->filter()->values();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Successfully retrieved completed courses.',
            'data' => $completedCourses,
        ], 200);
    }
}
