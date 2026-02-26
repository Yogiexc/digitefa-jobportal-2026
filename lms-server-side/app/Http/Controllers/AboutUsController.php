<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AboutUs;

class AboutUsController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            'content' => 'nullable|string',
        ]);
    }

    private function storeFile($file)
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $fileName);
        return $fileName;
    }

    private function deleteOldFile($fileName)
    {
        $filePath = public_path($fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index()
    {
        $aboutUsEntries = AboutUs::all();
        return response()->json($aboutUsEntries);
    }

    public function show($id)
    {
        $aboutUsEntry = AboutUs::findOrFail($id);
        return response()->json($aboutUsEntry);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeFile($request->file('image'));
        }
        $aboutUsEntry = AboutUs::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'About Us entry created successfully',
            'about_us' => $aboutUsEntry,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $aboutUsEntry = AboutUs::findOrFail($id);
        if ($request->hasFile('image')) {
            if ($aboutUsEntry->image) {
                $this->deleteOldFile($aboutUsEntry->image);
            }
            $validated['image'] = $this->storeFile($request->file('image'));
        }
        $aboutUsEntry->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'About Us entry updated successfully',
            'about_us' => $aboutUsEntry,
        ], 200);
    }

    public function destroy($id)
    {
        $aboutUsEntry = AboutUs::findOrFail($id);
        if ($aboutUsEntry->image) {
            $this->deleteOldFile($aboutUsEntry->image);
        }
        $aboutUsEntry->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'About Us entry deleted successfully'
        ], 200);
    }

    public function getAboutUs()
    {
        $aboutUs = AboutUs::first();

        if ($aboutUs) {
            return response()->json($aboutUs);
        } else {
            return response()->json(['message' => 'No about us data found'], 404);
        }
    }

    public function updateAboutUs(Request $request)
    {
        $aboutUs = AboutUs::first();

        if (!$aboutUs) {
            $aboutUs = new AboutUs();
        }

        $validated = $this->validateRequest($request);

        if ($request->hasFile('image')) {
            if ($aboutUs->image) {
                $this->deleteOldFile($aboutUs->image);
            }
            $validated['image'] = $this->storeFile($request->file('image'));
        }

        $aboutUs->fill($validated);
        $aboutUs->save();

        return response()->json(['message' => 'About us updated successfully', 'about_us' => $aboutUs]);
    }
}
