<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Models\Teacher;
use App\Models\User;
use App\Models\TeacherUpdateRequest;
use App\Models\TeacherUpdateCertificate;
use App\Models\TeacherCertificate;

class TeacherUpdateRequestController extends Controller
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

    private function moveFile($sourcePath, $destinationDirectory)
    {
        $fileName = basename($sourcePath);

        if (preg_match('/_\d{10}/', $fileName)) {
            $uniqueFileName = $fileName;
        } else {
            $extension = pathinfo($fileName, PATHINFO_EXTENSION);
            $fileNameWithoutExt = pathinfo($fileName, PATHINFO_FILENAME);
            $uniqueFileName = $fileNameWithoutExt . '_' . time() . '.' . $extension;
        }

        $destinationPath = public_path($destinationDirectory . $uniqueFileName);

        if (!file_exists(dirname($destinationPath))) {
            mkdir(dirname($destinationPath), 0755, true);
        }

        if (copy($sourcePath, $destinationPath)) {
            unlink($sourcePath);
            return $uniqueFileName;
        }

        throw new \Exception("Failed to move file from $sourcePath to $destinationPath");
    }

    public function canCreateUpdateRequest($teacherId)
    {
        $existingRequest = TeacherUpdateRequest::where('id_teacher', $teacherId)
            ->where('status', 'submitted')
            ->exists();

        return !$existingRequest;
    }

    public function updateProfile(Request $request, $id)
    {
        $validated = $this->validateRequest($request, $id);
        $teacher = Teacher::with('user')->where('id_user', $id)->firstOrFail();

        if (!$this->canCreateUpdateRequest($teacher->id_teacher)) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'You still have update requests waiting for approval.'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $updateRequest = TeacherUpdateRequest::create([
                'id_teacher' => $teacher->id_teacher,
                'type' => 'profile',
                'name' => $validated['name'] ?? $teacher->user->name,
                'email' => $validated['email'] ?? $teacher->user->email,
                'address' => $validated['address'] ?? $teacher->address,
                'bio' => $validated['bio'] ?? $teacher->bio,
                'date_of_birth' => $validated['date_of_birth'] ?? $teacher->date_of_birth,
                'education' => $validated['education'] ?? $teacher->education,
                'year_of_experience' => $validated['year_of_experience'] ?? $teacher->year_of_experience,
                'phone_number' => $validated['phone_number'] ?? $teacher->phone_number,
                'status' => 'submitted',
                'note' => $validated['note'] ?? null,
                'affiliation' => $validated['affiliation'] ?? $teacher->affiliation,
            ]);

            if ($request->hasFile('photo_profile')) {
                $updateRequest->photo_profile = $this->storeFile($request->file('photo_profile'), 'uploads/Teacher/Update Request/Profile Picture/');
                $updateRequest->save();
            }

            if ($request->hasFile('portofolio')) {
                $updateRequest->portofolio = $this->storeFile($request->file('portofolio'), 'uploads/Teacher/Update Request/Portofolio/');
                $updateRequest->save();
            }

            if ($request->hasFile('identity')) {
                $updateRequest->identity = $this->storeFile($request->file('identity'), 'uploads/Teacher/Update Request/Identity/');
                $updateRequest->save();
            }

            if ($request->has('certificates')) {
                $uploadedCertificates = [];
                foreach ($request->input('certificates') as $key => $certificateData) {
                    $file = $request->file("certificates.$key.file");
                    $fileName = $this->storeFile($file, 'uploads/Teacher/Update Request/Teacher Certificates/');

                    $certificate = TeacherUpdateCertificate::create([
                        'id_teacher_update_request' => $updateRequest->id_teacher_update_request,
                        'file' => $fileName,
                        'name' => $certificateData['name'],
                    ]);

                    $uploadedCertificates[] = $certificate;
                }
            }

            if ($request->has('categories')) {
                $updateRequest->categories()->sync($request->input('categories'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Teacher update request created successfully',
                'update_request' => $updateRequest->load('categories'),
                'certificates' => $uploadedCertificates ?? [],
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Failed to create update request: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateLevel(Request $request, $id)
    {
        $teacher = Teacher::with('user')->where('id_user', $id)->firstOrFail();

        if (!$this->canCreateUpdateRequest($teacher->id_teacher)) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'You still have update requests waiting for approval.'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $updateRequest = TeacherUpdateRequest::create([
                'id_teacher' => $teacher->id_teacher,
                'type' => 'level',
                'status' => 'submitted',
            ]);

            if ($request->has('certificates')) {
                $uploadedCertificates = [];
                foreach ($request->input('certificates') as $key => $certificateData) {
                    $file = $request->file("certificates.$key.file");
                    $fileName = $this->storeFile($file, 'uploads/Teacher/Update Request/Teacher Certificates/');

                    $certificate = TeacherUpdateCertificate::create([
                        'id_teacher_update_request' => $updateRequest->id_teacher_update_request,
                        'file' => $fileName,
                        'name' => $certificateData['name'],
                    ]);

                    $uploadedCertificates[] = $certificate;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Teacher level update request created successfully',
                'update_request' => $updateRequest,
                'certificates' => $uploadedCertificates ?? [],
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Failed to create level update request: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'note' => 'nullable|string|max:255',
            'id_teacher_level' => [
                'required_if:type,level',
                'exists:teacher_levels,id_teacher_level'
            ],
        ]);

        $updateRequest = TeacherUpdateRequest::findOrFail($id);

        DB::beginTransaction();
        try {
            if ($validated['status'] === 'approved') {
                $teacher = Teacher::findOrFail($updateRequest->id_teacher);
                $user = $teacher->user;

                if ($updateRequest->type === 'profile') {
                    $user->update([
                        'name' => $updateRequest->name ?? $user->name,
                        'email' => $updateRequest->email ?? $user->email,
                    ]);

                    $teacher->update([
                        'address' => $updateRequest->address ?? $teacher->address,
                        'bio' => $updateRequest->bio ?? $teacher->bio,
                        'date_of_birth' => $updateRequest->date_of_birth ?? $teacher->date_of_birth,
                        'education' => $updateRequest->education ?? $teacher->education,
                        'year_of_experience' => $updateRequest->year_of_experience ?? $teacher->year_of_experience,
                        'phone_number' => $updateRequest->phone_number ?? $teacher->phone_number,
                        'status' => 'approved',
                        'note' => $updateRequest->note ?? null,
                        'affiliation' => $updateRequest->affiliation ?? $teacher->affiliation,
                    ]);

                    $baseUpdateRequestPath = public_path('uploads/Teacher/Update Request/');
                    $baseTeacherPath = public_path('uploads/Teachers/');

                    if ($updateRequest->photo_profile) {
                        if ($teacher->photo_profile) {
                            $this->deleteOldFile($teacher->photo_profile, 'uploads/Teacher/Profile Picture/');
                        }

                        $sourcePath = $baseUpdateRequestPath . 'Profile Picture/' . $updateRequest->photo_profile;
                        $teacher->photo_profile = $this->moveFile(
                            $sourcePath,
                            'uploads/Teacher/Profile Picture/'
                        );
                    }

                    if ($updateRequest->portofolio) {
                        if ($teacher->portofolio) {
                            $this->deleteOldFile($teacher->portofolio, 'uploads/Teacher/Portofolio/');
                        }

                        $sourcePath = $baseUpdateRequestPath . 'Portofolio/' . $updateRequest->portofolio;
                        $teacher->portofolio = $this->moveFile(
                            $sourcePath,
                            'uploads/Teacher/Portofolio/'
                        );
                    }

                    if ($updateRequest->identity) {
                        if ($teacher->identity) {
                            $this->deleteOldFile($teacher->identity, 'uploads/Teacher/Identity/');
                        }
                        $sourcePath = $baseUpdateRequestPath . 'Identity/' . $updateRequest->identity;
                        $teacher->identity = $this->moveFile(
                            $sourcePath,
                            'uploads/Teacher/Identity/'
                        );
                    }

                    $oldCertificates = TeacherCertificate::where('id_teacher', $teacher->id_teacher)->get();
                    foreach ($oldCertificates as $oldCertificate) {
                        $this->deleteOldFile($oldCertificate->file, 'uploads/Teacher/Teacher Certificates/');
                        $oldCertificate->delete();
                    }

                    foreach ($updateRequest->certificates as $certRequest) {
                        $sourcePath = $baseUpdateRequestPath . 'Teacher Certificates/' . $certRequest->file;
                        TeacherCertificate::create([
                            'id_teacher' => $teacher->id_teacher,
                            'name' => $certRequest->name,
                            'file' => $this->moveFile(
                                $sourcePath,
                                'uploads/Teacher/Teacher Certificates/'
                            ),
                        ]);
                    }

                    $teacher->categoriesTeacher()->sync(
                        $updateRequest->categories->pluck('id_category')
                    );

                    $teacher->save();
                } elseif ($updateRequest->type === 'level') {
                    $teacher->update([
                        'id_teacher_level' => $validated['id_teacher_level'],
                    ]);

                    $baseUpdateRequestPath = public_path('uploads/Teacher/Update Request/');
                    $oldCertificates = TeacherCertificate::where('id_teacher', $teacher->id_teacher)->get();
                    foreach ($oldCertificates as $oldCertificate) {
                        $this->deleteOldFile($oldCertificate->file, 'uploads/Teacher/Teacher Certificates/');
                        $oldCertificate->delete();
                    }

                    foreach ($updateRequest->certificates as $certRequest) {
                        $sourcePath = $baseUpdateRequestPath . 'Teacher Certificates/' . $certRequest->file;
                        TeacherCertificate::create([
                            'id_teacher' => $teacher->id_teacher,
                            'name' => $certRequest->name,
                            'file' => $this->moveFile(
                                $sourcePath,
                                'uploads/Teacher/Teacher Certificates/'
                            ),
                        ]);
                    }
                }
            }

            $updateRequest->update([
                'status' => $validated['status'],
                'note' => $validated['status'] === 'rejected' ? $validated['note'] : null,
            ]);

            DB::commit();

            return response()->json([
                'message' => "Update request status updated to {$validated['status']}",
                'data' => $updateRequest,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Failed to update status: ' . $e->getMessage(),
                'error_details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]
            ], 500);
        }
    }

    public function listUpdateRequests()
    {
        $updateRequests = TeacherUpdateRequest::with(['teacher.user', 'certificates', 'categories'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Teacher update requests retrieved successfully',
            'data' => $updateRequests,
        ]);
    }

    public function getUpdateRequestDetail($id)
    {
        $updateRequest = TeacherUpdateRequest::with(['teacher.user', 'certificates', 'categories'])
            ->whereHas('teacher', function ($query) use ($id) {
                $query->where('id_user', $id);
            })->get();

        if ($updateRequest->isEmpty()) {
            return response()->json([
                'success' => false,
                'status_code' => 404,
                'message' => 'No update requests found for the specified user.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Teacher update request detail retrieved successfully',
            'data' => $updateRequest,
        ]);
    }
}
