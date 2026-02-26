<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'answer' => 'required|string',
        ]);
    }

    public function index()
    {
        $faqs = Faq::all();
        return response()->json($faqs);
    }

    public function show($id)
    {
        $faq = Faq::findOrFail($id);
        return response()->json($faq);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $faq = Faq::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'FAQ created successfully',
            'faq' => $faq,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $faq = Faq::findOrFail($id);
        $faq->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'FAQ updated successfully',
            'faq' => $faq,
        ], 200);
    }

    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'FAQ deleted successfully'
        ], 200);
    }
}
