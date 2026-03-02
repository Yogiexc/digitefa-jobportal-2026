<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string|max:255',
        ]);
    }

    public function index()
    {
        $categories = Category::with('courses')->get();
        return response()->json($categories);
    }

    public function show($id)
    {
        $category = Category::with('courses')->findOrFail($id);
        return response()->json($category);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $category = Category::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $category = Category::findOrFail($id);
        $category->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Category updated successfully',
            'category' => $category,
        ], 200);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Category deleted successfully'
        ], 200);
    }
}
