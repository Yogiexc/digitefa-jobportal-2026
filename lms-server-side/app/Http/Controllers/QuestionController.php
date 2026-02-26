<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

class QuestionController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'questions' => 'required|string',
        ]);
    }

    public function index()
    {
        $questions = Question::all();
        return response()->json($questions);
    }

    public function show($id)
    {
        $question = Question::findOrFail($id);
        return response()->json($question);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $question = Question::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Question submitted successfully',
            'question' => $question,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $question = Question::findOrFail($id);
        $question->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Question updated successfully',
            'question' => $question,
        ], 200);
    }

    public function destroy($id)
    {
        $question = Question::findOrFail($id);
        $question->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Question deleted successfully'
        ], 200);
    }
}
