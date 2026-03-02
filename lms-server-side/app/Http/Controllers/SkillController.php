<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Skill;

class SkillController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_category' => 'required|exists:categories,id_category',
            'name' => 'required|string|max:255',
        ]);
    }

    public function index()
    {
        $skills = Skill::with('category')->get();
        return response()->json($skills);
    }

    public function show($id)
    {
        $skill = Skill::with('category')->findOrFail($id);
        return response()->json($skill);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Skill created successfully',
            'skill' => $skill,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $skill = Skill::findOrFail($id);
        $skill->update($validated);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Skill updated successfully',
            'skill' => $skill,
        ], 200);
    }

    public function destroy($id)
    {
        $skill = Skill::findOrFail($id);
        $skill->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Skill deleted successfully'
        ], 200);
    }
}
