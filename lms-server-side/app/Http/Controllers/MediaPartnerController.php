<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MediaPartner;
use Illuminate\Support\Facades\Storage;

class MediaPartnerController extends Controller
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
        $file->move('uploads/media_partner/', $filename);
        return $filename;
    }

    private function deleteOldFile($fileName)
    {
        $filePath = public_path('uploads/media_partner/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index()
    {
        $mediaPartners = MediaPartner::all();
        return response()->json($mediaPartners);
    }

    public function show($id)
    {
        $mediaPartner = MediaPartner::findOrFail($id);
        return response()->json($mediaPartner);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeFile($request->file('image'));
        }

        $mediaPartner = MediaPartner::create($validated);

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Media partner created successfully',
            'media_partner' => $mediaPartner,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $mediaPartner = MediaPartner::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($mediaPartner->image) {
                $this->deleteOldFile($mediaPartner->image);
            }
            $validated['image'] = $this->storeFile($request->file('image'));
        }

        $mediaPartner->update($validated);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Media partner updated successfully',
            'media_partner' => $mediaPartner,
        ], 200);
    }

    public function destroy($id)
    {
        $mediaPartner = MediaPartner::findOrFail($id);

        if ($mediaPartner->image) {
            $this->deleteOldFile($mediaPartner->image);
        }

        $mediaPartner->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Media partner deleted successfully'
        ], 200);
    }
}
