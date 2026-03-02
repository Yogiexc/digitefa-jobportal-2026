<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TeacherReview;

class TeacherReviewController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_student' => 'required|uuid|exists:students,id_student',
            'id_teacher' => 'required|uuid|exists:teachers,id_teacher',
            'rating' => 'required|integer|between:1,5',
            'content' => 'nullable|string',
        ]);
    }

    public function index()
    {
        $reviews = TeacherReview::with(['student', 'teacher'])->get();
        return response()->json($reviews);
    }

    public function show($id)
    {
        $review = TeacherReview::with(['student', 'teacher'])->findOrFail($id);
        return response()->json($review);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $review = TeacherReview::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Teacher review created successfully',
            'review' => $review,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $review = TeacherReview::findOrFail($id);
        $review->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Teacher review updated successfully',
            'review' => $review,
        ], 200);
    }

    public function destroy($id)
    {
        $review = TeacherReview::findOrFail($id);
        $review->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Teacher review deleted successfully'
        ], 200);
    }
}
