<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Testimony;

class TestimonyController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_student' => 'required|uuid|exists:students,id_student',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);
    }

    public function index()
    {
        $testimonies = Testimony::with('student')->get();
        return response()->json($testimonies);
    }

    public function show($id)
    {
        $testimony = Testimony::with('student')->findOrFail($id);
        return response()->json($testimony);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $testimony = Testimony::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Testimony created successfully',
            'testimony' => $testimony,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $testimony = Testimony::findOrFail($id);
        $testimony->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Testimony updated successfully',
            'testimony' => $testimony,
        ], 200);
    }

    public function destroy($id)
    {
        $testimony = Testimony::findOrFail($id);
        $testimony->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Testimony deleted successfully'
        ], 200);
    }
}
