<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseContent;

class CourseContentController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course' => 'required|exists:courses,id_course',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_link' => 'nullable|url',
        ]);
    }

    public function index()
    {
        $courseContents = CourseContent::with(['courseSection', 'files'])->get();
        return response()->json($courseContents);
    }

    public function show($id)
    {
        $courseContent = CourseContent::with(['courseSection', 'files'])->findOrFail($id);
        return response()->json($courseContent);
    }


    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $courseContent = CourseContent::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Course content created successfully',
            'course_content' => $courseContent,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $courseContent = CourseContent::findOrFail($id);
        $courseContent->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course content updated successfully',
            'course_content' => $courseContent,
        ], 200);
    }

    public function destroy($id)
    {
        $courseContent = CourseContent::findOrFail($id);
        $courseContent->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course content deleted successfully'
        ], 200);
    }
}
