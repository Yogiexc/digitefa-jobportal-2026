<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\AssignmentSubmission;
use App\Models\AssignmentSubmissionResource;
use App\Models\CourseEnrollment;

class AssignmentSubmissionController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course_assignment' => 'nullable|exists:course_assignments,id_course_assignment',
            'id_course_enrollment' => 'nullable|exists:course_enrollments,id_course_enrollment',
            'grade' => 'nullable|integer',
            'files.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,word,zip,rar',
        ]);
    }
    public function index()
    {
        $assignmentSubmission = AssignmentSubmission::with(['courseEnrollment', 'courseAssignment', 'resources'])->get();
        return response()->json($assignmentSubmission);
    }

    public function show($id)
    {
        $assignmentSubmission = AssignmentSubmission::with(['courseEnrollment', 'courseAssignment', 'resources'])->findOrFail($id);
        return response()->json($assignmentSubmission);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        $courseEnrollment = CourseEnrollment::findOrFail($validated['id_course_enrollment']);

        $validated['submission_date'] = now();

        $assignmentSubmission = AssignmentSubmission::create($validated);

        $uploadedFiles = [];
        if ($request->hasFile('files')) {
            $folderName = "Course Assignment Submission";
            $uploadedFiles = $this->uploadFilesToGoogleDrive($request->file('files'), $assignmentSubmission->id_assignment_submission, $folderName);
        }

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Assignment submission created successfully',
            'course_assignment_submission' => $assignmentSubmission->load('resources'),
            'uploaded_files' => $uploadedFiles,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $courseAssignmentSubmission = AssignmentSubmission::findOrFail($id);

        $courseAssignmentSubmission->update($validated);

        $uploadedFiles = [];
        if ($request->hasFile('files')) {
            foreach ($courseAssignmentSubmission->resources as $existingResource) {
                try {
                    $accessToken = $this->getGoogleAccessToken();

                    $deleteResponse = Http::withToken($accessToken)
                        ->delete("https://www.googleapis.com/drive/v3/files/{$existingResource->fileid}");

                    $existingResource->delete();
                } catch (\Exception $e) {
                    Log::error('Failed to delete existing resource: ' . $e->getMessage());
                }
            }

            $folderName = "Course Assignment Submission";
            $uploadedFiles = $this->uploadFilesToGoogleDrive($request->file('files'), $courseAssignmentSubmission->id_assignment_submission, $folderName);
        }

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course assignment submission updated successfully',
            'course_assignment_submission' => $courseAssignmentSubmission->load('resources'),
            'uploaded_files' => $uploadedFiles,
        ], 200);
    }

    public function destroy($id)
    {
        $courseAssignmentSubmission = AssignmentSubmission::findOrFail($id);

        foreach ($courseAssignmentSubmission->resources as $resource) {
            try {
                $accessToken = $this->getGoogleAccessToken();
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$resource->fileid}");
                $resource->delete();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Failed to delete associated resources'], 500);
            }
        }

        $courseAssignmentSubmission->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course assignment submission deleted successfully'
        ], 200);
    }

    public function updateGrade(Request $request, $id_assignment_submission)
    {
        $validated = $request->validate([
            'grade' => 'required|integer',
        ]);
        $courseAssignmentSubmission = AssignmentSubmission::findOrFail($id_assignment_submission);
        $courseAssignmentSubmission->update($validated);
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Grade updated successfully',
            'course_assignment_submission' => $courseAssignmentSubmission,
        ], 200);
    }

    public function downloadAllResources($id)
    {
        $courseAssignmentSubmission = AssignmentSubmission::with('resources')->findOrFail($id);
        $accessToken = $this->getGoogleAccessToken();

        $zipFileName = 'Assignment_Submission_Resources.zip';
        if ($courseAssignmentSubmission->courseAssignment) {
            $zipFileName = $courseAssignmentSubmission->courseAssignment->title . '_submission_resources.zip';
        }

        return response()->stream(
            function () use ($courseAssignmentSubmission, $accessToken) {
                $zip = new \ZipStream\ZipStream(
                    outputName: 'Assignment_Submission_Resources.zip',
                    sendHttpHeaders: true
                );

                foreach ($courseAssignmentSubmission->resources as $resource) {
                    try {
                        $response = Http::withHeaders([
                            'Authorization' => 'Bearer ' . $accessToken,
                        ])->get("https://www.googleapis.com/drive/v3/files/{$resource->fileid}?alt=media");

                        if ($response->successful()) {
                            $zip->addFile(
                                fileName: $resource->name,
                                data: $response->body()
                            );
                        } else {
                            Log::error("Failed to retrieve file: {$resource->name} (ID: {$resource->fileid})");
                        }
                    } catch (\Exception $e) {
                        Log::error("Error processing file {$resource->name}: " . $e->getMessage());
                    }
                }

                $zip->finish();
            },
            200,
            [
                'Content-Type' => 'application/zip',
                'Content-Disposition' => 'attachment; filename="' . $zipFileName . '"',
            ]
        );
    }

    private function uploadFilesToGoogleDrive($files, $idCourseAssignmentSubmission, $folderName)
    {
        $uploadedFiles = [];
        $accessToken = $this->getGoogleAccessToken();
        $mainFolderId = config('services.google.folder_id');

        $subFolderId = $this->createGoogleDriveFolder($folderName, $mainFolderId, $accessToken);

        foreach ($files as $file) {
            $name = $file->getClientOriginalName();
            $path = $file->getRealPath();
            $fileContent = file_get_contents($path);
            $fileSize = filesize($path);

            try {
                $metadata = [
                    'name' => $name,
                    'parents' => [$subFolderId],
                ];

                $metadataResponse = Http::withToken($accessToken)
                    ->withHeaders(['Content-Type' => 'application/json; charset=UTF-8'])
                    ->post('https://www.googleapis.com/drive/v3/files', $metadata);

                if (!$metadataResponse->successful()) {
                    throw new \Exception('Failed to create file metadata in Google Drive');
                }

                $fileId = json_decode($metadataResponse->body())->id;

                $contentResponse = Http::withToken($accessToken)
                    ->withHeaders([
                        'Content-Type' => $file->getMimeType(),
                        'Content-Length' => $fileSize,
                    ])
                    ->withBody($fileContent, $file->getMimeType())
                    ->patch("https://www.googleapis.com/upload/drive/v3/files/{$fileId}?uploadType=media");

                if (!$contentResponse->successful()) {
                    throw new \Exception('Failed to upload file content to Google Drive');
                }

                $uploadedFile = new AssignmentSubmissionResource;
                $uploadedFile->name = $name;
                $uploadedFile->fileid = $fileId;
                $uploadedFile->id_assignment_submission = $idCourseAssignmentSubmission;
                $uploadedFile->save();

                $uploadedFiles[] = $uploadedFile;
            } catch (\Exception $e) {
                throw new \Exception('Google Drive upload error: ' . $e->getMessage());
            }
        }

        return $uploadedFiles;
    }

    private function createGoogleDriveFolder($folderName, $parentFolderId, $accessToken)
    {
        $response = Http::withToken($accessToken)->get('https://www.googleapis.com/drive/v3/files', [
            'q' => sprintf("name='%s' and '%s' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false", $folderName, $parentFolderId),
            'fields' => 'files(id, name)',
        ]);

        $existingFolders = json_decode($response->getBody(), true)['files'] ?? [];

        if (count($existingFolders) > 0) {
            return $existingFolders[0]['id'];
        }

        $metadata = [
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => [$parentFolderId],
        ];

        $folderResponse = Http::withToken($accessToken)
            ->withHeaders(['Content-Type' => 'application/json; charset=UTF-8'])
            ->post('https://www.googleapis.com/drive/v3/files', $metadata);

        if (!$folderResponse->successful()) {
            throw new \Exception('Failed to create subfolder in Google Drive');
        }

        return json_decode($folderResponse->getBody(), true)['id'];
    }

    private function getGoogleAccessToken()
    {
        $client_id = config('services.google.client_id');
        $client_secret = config('services.google.client_secret');
        $refresh_token = config('services.google.refresh_token');

        $response = Http::post('https://oauth2.googleapis.com/token', [
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'refresh_token' => $refresh_token,
            'grant_type' => 'refresh_token',
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to obtain Google Access Token');
        }

        return json_decode($response->getBody(), true)['access_token'];
    }

    public function showByCourse($id_course)
    {
        $assignmentSubmissions = AssignmentSubmission::with(['courseEnrollment', 'courseAssignment', 'resources'])
            ->whereHas('courseAssignment', function ($query) use ($id_course) {
                $query->where('id_course', $id_course);
            })
            ->get();

        return response()->json($assignmentSubmissions);
    }

    public function showByCourseAssignment($id_course_assignment)
    {
        $assignmentSubmissions = AssignmentSubmission::with(['courseEnrollment', 'courseAssignment', 'resources'])
            ->where('id_course_assignment', $id_course_assignment)
            ->get();

        return response()->json($assignmentSubmissions);
    }
}
