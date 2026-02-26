<?php

namespace App\Http\Controllers;

use App\Models\TeacherCertificate;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeacherCertificateController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);
    }

    private function storeFile($file)
    {
        $fileName = $file->getClientOriginalExtension() . '.' . time();
        $file->move('uploads/Teachers Certificates/', $fileName);
        return $fileName;
    }

    private function deleteOldFile($fileName)
    {
        $filePath = public_path('uploads/Teachers Certificates/' . $fileName);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function index($idTeacher)
    {
        $certificates = TeacherCertificate::where('id_teacher', $idTeacher)->get();

        return response()->json([
            'success' => true,
            'certificates' => $certificates,
        ]);
    }

    public function store(Request $request, $idTeacher)
    {
        $request->validate([
            'files.*' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        $teacher = Teacher::findOrFail($idTeacher);

        $uploadedCertificates = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $fileName = $file->getClientOriginalExtension() . '.' . time();
                $file->move(public_path('uploads/Teachers Certificates'), $fileName);

                $certificate = TeacherCertificate::create([
                    'id_teacher_certificate' => Str::uuid(),
                    'id_teacher' => $teacher->id_teacher,
                    'file' => $fileName,
                ]);

                $uploadedCertificates[] = $certificate;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Certificates uploaded successfully',
            'certificates' => $uploadedCertificates,
        ]);
    }


    public function destroy($idCertificate)
    {
        $certificate = TeacherCertificate::findOrFail($idCertificate);

        $this->deleteOldFile($certificate->file);
        $certificate->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certificate deleted successfully',
        ]);
    }
}
