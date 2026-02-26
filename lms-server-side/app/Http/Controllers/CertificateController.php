<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Certificate;

class CertificateController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course' => 'required|uuid|exists:courses,id_course',
            'id_student' => 'required|uuid|exists:students,id_student',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);
    }

    private function storeFile($file)
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->move('uploads/certificates/', $fileName);
        return $fileName;
    }

    private function deleteOldFile($fileName)
    {
        $filePath = public_path('uploads/certificates/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index()
    {
        $certificates = Certificate::all();
        return response()->json($certificates);
    }

    public function show($id)
    {
        $certificate = Certificate::findOrFail($id);
        return response()->json($certificate);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        if ($request->hasFile('file')) {
            $validated['file'] = $this->storeFile($request->file('file'));
        }
        $certificate = Certificate::create($validated);
        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Certificate created successfully',
            'certificate' => $certificate,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $certificate = Certificate::findOrFail($id);
        if ($request->hasFile('file')) {
            if ($certificate->file) {
                $this->deleteOldFile($certificate->file);
            }
            $validated['file'] = $this->storeFile($request->file('file'));
        }
        $certificate->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Certificate updated successfully',
            'certificate' => $certificate,
        ], 200);
    }

    public function destroy($id)
    {
        $certificate = Certificate::findOrFail($id);
        if ($certificate->file) {
            $this->deleteOldFile($certificate->file);
        }
        $certificate->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Certificate deleted successfully'
        ], 200);
    }
}
