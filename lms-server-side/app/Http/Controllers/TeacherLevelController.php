<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TeacherLevel;

class TeacherLevelController extends Controller
{

    private function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'max_course' => 'required|integer|min:0',
            'id_course_level' => 'required|array',
            'id_course_level.*' => 'exists:course_levels,id_course_level',
        ]);
    }

    public function index()
    {
        $teacherLevels = TeacherLevel::with('allowedCourseLevels')->get();
        return response()->json($teacherLevels);
    }


    public function show($id)
    {
        $teacherLevel = TeacherLevel::with('allowedCourseLevels')->findOrFail($id);
        return response()->json($teacherLevel);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        $teacherLevel = TeacherLevel::create($validated);

        if (isset($request->id_course_level)) {
            $teacherLevel->allowedCourseLevels()->sync($request->id_course_level);
        }

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Teacher level created successfully',
            'teacher_level' => $teacherLevel->load('allowedCourseLevels'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);

        $teacherLevel = TeacherLevel::findOrFail($id);

        $teacherLevel->update($validated);

        if (isset($validated['id_course_level']) && is_array($validated['id_course_level'])) {
            $teacherLevel->allowedCourseLevels()->sync($validated['id_course_level']);
        }

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Teacher level updated successfully',
            'teacher_level' => $teacherLevel->load('allowedCourseLevels'),
        ], 200);
    }

    public function destroy($id)
    {
        $teacherLevel = TeacherLevel::findOrFail($id);
        $teacherLevel->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Teacher level deleted successfully',
        ], 200);
    }

    public function updateAllowedCourses(Request $request, $id)
    {
        $teacherLevel = TeacherLevel::findOrFail($id);

        $validatedData = $request->validate([
            'id_course_level' => 'required|array',
            'id_course_level.*' => 'exists:course_levels,id_course_level'
        ]);

        $teacherLevel->courseLevels()->sync($validatedData['id_course_level']);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Allowed courses updated successfully',
            'teacher_level' => $teacherLevel->load('courseLevels'),
        ], 200);
    }
}
