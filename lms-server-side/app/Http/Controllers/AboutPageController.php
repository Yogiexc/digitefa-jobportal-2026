<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AboutPage;

class AboutPageController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'description.*' => 'nullable|string',
            'subtitles' => 'nullable|array',
            'subtitles.*.subtitle' => 'nullable|string|max:255',
            'subtitles.*.description' => 'nullable|string',
        ]);
    }

    private function storeFile($file)
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->move('uploads/', $fileName);
        return $fileName;
    }

    private function deleteOldFile($fileName)
    {
        $filePath = public_path('uploads/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index()
    {
        $aboutPages = AboutPage::with('subsections')->get();
        return response()->json($aboutPages);
    }

    public function show($id)
    {
        $aboutPage = AboutPage::with('subsections')->findOrFail($id);
        // $aboutPage = AboutPage::findOrFail($id);
        return response()->json($aboutPage);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeFile($request->file('image'));
        }
        $aboutPage = AboutPage::create($validated);

        //TAMBAHAN //
        if (!empty($validated['subtitles'])) {
            foreach ($validated['subtitles'] as $subtitleData) {
                $aboutPage->subsections()->create($subtitleData);
            }
        }
        //TAMBAHAN //
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'About page created successfully',
            'about_page' => $aboutPage,
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $aboutPage = AboutPage::findOrFail($id);
        if ($request->hasFile('image')) {
            if ($aboutPage->image) {
                $this->deleteOldFile($aboutPage->image);
            }
            $validated['image'] = $this->storeFile($request->file('image'));
        }
        $aboutPage->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'About page updated successfully',
            'about_page' => $aboutPage,
        ], 200);
    }

    public function destroy($id)
    {
        $aboutPage = AboutPage::findOrFail($id);
        if ($aboutPage->image) {
            $this->deleteOldFile($aboutPage->image);
        }
        $aboutPage->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'About page deleted successfully'
        ], 200);
    }
}
