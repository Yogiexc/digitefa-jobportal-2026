<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SocialMedia;
use Illuminate\Support\Facades\Storage;

class SocialMediaController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'phone_number' => 'required|string|max:16',
            'tiktok' => 'nullable|url',
            'instagram' => 'nullable|url',
            'x' => 'nullable|url',
            'youtube' => 'nullable|url',
            'linkedin' => 'nullable|url',
        ]);
    }

    private function storeFile($file)
    {
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move('uploads/social_media/', $filename);
        return $filename;
    }


    private function deleteOldFile($fileName)
    {
        $filePath = public_path('uploads/social_media/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index()
    {
        $socialMedia = SocialMedia::all();
        return response()->json($socialMedia);
    }

    public function show($id)
    {
        $socialMedia = SocialMedia::findOrFail($id);
        return response()->json($socialMedia);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        $socialMedia = SocialMedia::create($validated);

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Social media created successfully',
            'social_media' => $socialMedia,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $socialMedia = SocialMedia::findOrFail($id);

        $socialMedia->update($validated);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Social media updated successfully',
            'social_media' => $socialMedia,
        ], 200);
    }

    public function destroy($id)
    {
        $socialMedia = SocialMedia::findOrFail($id);

        $socialMedia->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Social media deleted successfully'
        ], 200);
    }

    public function getSocialMedia()
    {
        $socialMedia = SocialMedia::first();

        if ($socialMedia) {
            return response()->json($socialMedia);
        } else {
            return response()->json(['message' => 'No social media data found'], 404);
        }
    }

    public function updateSocialMedia(Request $request)
    {
        $validatedData = $this->validateRequest($request);
        $socialMedia = SocialMedia::firstOrCreate([]);
        $socialMedia->update($validatedData);

        return response()->json([
            'message' => 'Social media updated successfully.',
            'social_media' => $socialMedia,
        ]);

        return response()->json(['message' => 'Social media updated successfully']);
    }
}
