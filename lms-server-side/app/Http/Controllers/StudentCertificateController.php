<?php

namespace App\Http\Controllers;

use App\Models\StudentCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentCertificateController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course_enrollment' => 'required|exists:course_enrollments,id_course_enrollment',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);
    }

    private function storeFile($file, $directory)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $uniqueFileName = $fileName . '_' . time() . '.' . $extension;

        $file->move($directory, $uniqueFileName);
        return $uniqueFileName;
    }

    private function deleteOldFile($fileName, $directory)
    {
        $filePath = public_path($directory . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index()
    {
        $certificates = StudentCertificate::with('courseEnrollment')->get();
        return response()->json($certificates);
    }

    public function show($idStudentCertificate)
    {
        $certificate = StudentCertificate::with('courseEnrollment')->findOrFail($idStudentCertificate);
        return response()->json($certificate);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        if ($request->hasFile('file')) {
            $validated['file'] = $this->storeFile($request->file('file'), 'uploads/certificates/');
        }

        $certificate = StudentCertificate::create($validated);

        return response()->json($certificate, 201);
    }

    public function update(Request $request, $idStudentCertificate)
    {
        $validated = $this->validateRequest($request);
        $certificate = StudentCertificate::findOrFail($idStudentCertificate);

        if ($request->hasFile('file')) {
            if ($certificate->file) {
                $this->deleteOldFile($certificate->file, 'uploads/Student Certificates/');
            }
            $validated['file'] = $this->storeFile($request->file('file'), 'uploads/Student Certificates/');
        }

        $certificate->update($validated);

        return response()->json($certificate);
    }

    public function destroy($idStudentCertificate)
    {
        $certificate = StudentCertificate::findOrFail($idStudentCertificate);

        if ($certificate->file) {
            $this->deleteOldFile($certificate->file, 'uploads/Student Certificates/');
        }

        $certificate->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Certificate deleted successfully'
        ], 200);
    }

    public function download($idStudentCertificate)
    {
        $certificate = StudentCertificate::findOrFail($idStudentCertificate);
        $filePath = public_path('uploads/Student Certificates/' . $certificate->file);

        return response()->download($filePath);
    }

    public function getStudentCertificatesByStudents($idStudent)
    {
        $certificates = StudentCertificate::with('courseEnrollment')
            ->whereHas('courseEnrollment', function ($query) use ($idStudent) {
                $query->where('id_student', $idStudent);
            })
            ->get();

        return response()->json($certificates);
    }
}
