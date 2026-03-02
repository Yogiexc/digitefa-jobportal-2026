<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseReview;

class CourseReviewController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_student' => 'required|uuid|exists:students,id_student',
            'id_course' => 'required|uuid|exists:courses,id_course',
            'rating' => 'required|integer|between:1,5',
            'content' => 'nullable|string',
        ]);
    }

    public function index()
    {
        $reviews = CourseReview::with(['student', 'course'])->get();
        return response()->json($reviews);
    }

    public function show($id)
    {
        $review = CourseReview::with(['student', 'course'])->findOrFail($id);
        return response()->json($review);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $review = CourseReview::create($validated);
        return response()->json([
            'message' => 'Course review created successfully',
            'review' => $review,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $review = CourseReview::findOrFail($id);
        $review->update($validated);
        return response()->json([
            'message' => 'Course review updated successfully',
            'review' => $review,
        ], 200);
    }

    public function destroy($id)
    {
        $review = CourseReview::findOrFail($id);
        $review->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course review deleted successfully'
        ], 200);
    }
}
