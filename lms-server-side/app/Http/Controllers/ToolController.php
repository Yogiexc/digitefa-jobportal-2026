<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tool; 
use Illuminate\Support\Facades\Storage;

class ToolController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    }

    private function storeFile($file)
    {
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move('uploads/tools/', $filename);
        return $filename;
    }

    private function deleteOldFile($fileName)
    {
        $filePath = public_path('uploads/tools/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index()
    {
        $tools = Tool::all();
        return response()->json($tools);
    }

    public function show($id)
    {
        $tool = Tool::findOrFail($id);
        return response()->json($tool);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeFile($request->file('image'));
        }

        $tool = Tool::create($validated);

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Tool created successfully',
            'tool' => $tool,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $tool = Tool::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($tool->image) {
                $this->deleteOldFile($tool->image);
            }
            $validated['image'] = $this->storeFile($request->file('image'));
        }

        $tool->update($validated);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Tool updated successfully',
            'tool' => $tool,
        ], 200);
    }

    public function destroy($id)
    {
        $tool = Tool::findOrFail($id);

        if ($tool->image) {
            $this->deleteOldFile($tool->image);
        }

        $tool->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Tool deleted successfully'
        ], 200);
    }
}
