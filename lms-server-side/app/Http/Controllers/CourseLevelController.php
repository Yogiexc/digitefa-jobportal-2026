<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseLevel;

class CourseLevelController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'point_course_material' => 'required|integer|min:0',
            'point_assignment' => 'required|integer|min:0',
            'point_quiz' => 'required|integer|min:0',
            'point_course_completion' => 'required|integer|min:0',
            'certificate' => 'required|boolean|default:false',
        ]);
    }

    public function index()
    {
        $courseLevels = CourseLevel::all();
        return response()->json($courseLevels);
    }

    public function show($id)
    {
        $courseLevel = CourseLevel::findOrFail($id);
        return response()->json($courseLevel);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $courseLevel = CourseLevel::create($validated);

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Course level created successfully',
            'course_level' => $courseLevel,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $courseLevel = CourseLevel::findOrFail($id);
        $courseLevel->update($validated);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course level updated successfully',
            'course_level' => $courseLevel,
        ], 200);
    }

    public function destroy($id)
    {
        $courseLevel = CourseLevel::findOrFail($id);
        $courseLevel->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course level deleted successfully'
        ], 200);
    }

    public function getAllowedTeacherLevels($id)
    {
        $courseLevel = CourseLevel::with('teacherLevels')->findOrFail($id);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Allowed teacher levels retrieved successfully',
            'allowed_teacher_levels' => $courseLevel->teacherLevels,
        ], 200);
    }
}
