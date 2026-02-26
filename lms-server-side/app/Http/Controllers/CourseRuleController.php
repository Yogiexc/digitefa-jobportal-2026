<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseRule;

class CourseRuleController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course' => 'required|exists:courses,id_course',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
    }

    public function index()
    {
        $courseRule = CourseRule::with('course')->get();
        return response()->json($courseRule);
    }

    public function show($id)
    {
        $courseRule = CourseRule::with('course')->findOrFail($id);
        return response()->json($courseRule);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $courseRule = CourseRule::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Rule created successfully',
            'rule' => $courseRule,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $courseRule = CourseRule::findOrFail($id);
        $courseRule->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Rule updated successfully',
            'rule' => $courseRule,
        ], 200);
    }

    public function destroy($id)
    {
        $courseRule = CourseRule::findOrFail($id);
        $courseRule->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Rule deleted successfully'
        ], 200);
    }
}
