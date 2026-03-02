<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Models\TeacherCertificate;
use App\Models\TeacherLevel;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    private function validateRequest(Request $request, $id = null)
    {
        return $request->validate([
            'email' => ['nullable', 'email', $id ? Rule::unique('users')->ignore($id, 'id_user') : Rule::unique('users'),],
            'name' => 'nullable|string',
            'address' => 'nullable|string',
            'bio' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'education' => 'nullable|string',
            'year_of_experience' => 'nullable|string',
            'phone_number' => 'nullable|regex:/^[0-9]{1,13}$/',
            'status' => ['nullable', Rule::in(['not_submitted', 'submitted', 'approved', 'rejected'])],
            'photo_profile' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'portofolio' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:15360',
            'identity' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:15360',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id_category',
            'certificates' => 'nullable|array',
            'certificates.*.name' => 'required|string',
            'certificates.*.file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:15360',
            'note' => 'nullable|string',
            'affiliation' => 'nullable|string',
        ]);
    }


    private function validateMethod(Request $request)
    {
        $method = $request->input('_method', 'PUT');
        if (!in_array(strtoupper($method), ['PUT', 'PATCH'])) {
            return response()->json(['error' => 'Metode HTTP tidak diizinkan'], 405);
        }
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

    public function update(Request $request, $id)
    {
        $this->validateMethod($request);
        $validated = $this->validateRequest($request, $id);

        $teacher = Teacher::with('user')->where('id_user', $id)->firstOrFail();

        if ($request->hasAny(['name', 'email'])) {
            $teacher->user->fill([
                'name' => $validated['name'] ?? $teacher->user->name,
                'email' => $validated['email'] ?? $teacher->user->email,
            ])->save();
        }

        $teacher->bio = $validated['bio'] ?? $teacher->bio;
        $teacher->address = $validated['address'] ?? $teacher->address;
        $teacher->education = $validated['education'] ?? $teacher->education;
        $teacher->year_of_experience = $validated['year_of_experience'] ?? $teacher->year_of_experience;
        $teacher->phone_number = $validated['phone_number'] ?? $teacher->phone_number;
        $teacher->status = 'submitted';
        $teacher->note = $validated['note'] ?? $teacher->note;
        $teacher->affiliation = $validated['affiliation'] ?? $teacher->affiliation;

        if ($request->has('date_of_birth')) {
            $teacher->date_of_birth = $validated['date_of_birth'];
        }

        if ($request->hasFile('photo_profile')) {
            if ($teacher->photo_profile) {
                $this->deleteOldFile($teacher->photo_profile, 'uploads/Teacher/Profile Picture/');
            }
            $teacher->photo_profile = $this->storeFile($request->file('photo_profile'), 'uploads/Teacher/Profile Picture/');
        }

        if ($request->hasFile('portofolio')) {
            if ($teacher->portofolio) {
                $this->deleteOldFile($teacher->portofolio, 'uploads/Teacher/Portofolio/');
            }
            $teacher->portofolio = $this->storeFile($request->file('portofolio'), 'uploads/Teacher/Portofolio/');
        }

        if ($request->hasFile('identity')) {
            if ($teacher->identity) {
                $this->deleteOldFile($teacher->identity, 'uploads/Teacher/Identity/');
            }
            $teacher->identity = $this->storeFile($request->file('identity'), 'uploads/Teacher/Identity/');
        }

        if ($request->has('certificates')) {
            $teacher->teacherCertificates()->each(function ($certificate) {
                $this->deleteOldFile($certificate->file, 'uploads/Teacher/Teacher Certificates/');
                $certificate->delete();
            });

            $uploadedCertificates = [];
            foreach ($request->input('certificates') as $key => $certificateData) {
                $file = $request->file("certificates.$key.file");
                $fileName = $this->storeFile($file, 'uploads/Teacher/Teacher Certificates/');

                $certificate = TeacherCertificate::create([
                    'id_teacher' => $teacher->id_teacher,
                    'file' => $fileName,
                    'name' => $certificateData['name'],
                ]);

                $uploadedCertificates[] = $certificate;
            }
        } else {
            $uploadedCertificates = [];
        }

        if ($request->has('categories')) {
            $teacher->categoriesTeacher()->sync($request->input('categories'));
        }

        $teacher->save();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Teacher data updated successfully',
            'teacher' => $teacher,
            'certificates' => $uploadedCertificates ?? [],
        ], 200);
    }

    public function getAllowedCourses($id)
    {
        $teacherLevel = TeacherLevel::with('courseLevels')->findOrFail($id);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Allowed courses retrieved successfully',
            'allowed_courses' => $teacherLevel->courseLevels,
        ], 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'note' => 'nullable:status,rejected|string|max:255',
        ]);

        $updateRequest = Teacher::where('id_user', $id)->first();

        if (!$updateRequest) {
            return response()->json([
                'message' => "Teacher with ID {$id} not found.",
            ], 404);
        }

        $updateRequest->update([
            'status' => $validated['status'],
            'note' => $validated['status'] === 'rejected' ? $validated['note'] : null,
        ]);

        return response()->json([
            'message' => "Update request status updated to {$validated['status']}",
            'data' => $updateRequest,
        ]);
    }
}
