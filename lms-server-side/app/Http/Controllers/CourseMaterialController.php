<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseMaterial;
use App\Models\CourseMaterialResource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CourseMaterialController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'id_course_section' => 'required|exists:course_sections,id_course_section',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_link' => 'nullable|url',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id_skill',
            'files.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,word,zip,rar',
        ]);
    }

    public function index()
    {
        $courseMaterials = CourseMaterial::with(['courseSection', 'resources', 'skills'])->get();
        return response()->json($courseMaterials);
    }

    public function show($id)
    {
        $courseMaterials = CourseMaterial::with(['courseSection', 'resources', 'skills'])->findOrFail($id);
        return response()->json($courseMaterials);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        $courseMaterial = CourseMaterial::create($validated);

        if (isset($validated['skills'])) {
            $courseMaterial->skills()->sync($validated['skills']);
        }

        if ($request->hasFile('files')) {
            $folderName = "Course Material Resources";
            $uploadedFiles = $this->uploadFilesToGoogleDrive($request->file('files'), $courseMaterial->id_course_material, $folderName);
        }

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Course material created successfully',
            'course_material' => $courseMaterial->load('skills', 'resources'),
            'uploaded_files' => $uploadedFiles ?? [],
        ], 201);
    }


    private function uploadFilesToGoogleDrive($files, $idCourseMaterial, $folderName)
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

                $uploadedFile = new CourseMaterialResource;
                $uploadedFile->name = $name;
                $uploadedFile->fileid = $fileId;
                $uploadedFile->id_course_material = $idCourseMaterial;
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

    public function update(Request $request, $id)
    {
        $courseMaterial = CourseMaterial::findOrFail($id);

        $validated = $this->validateRequest($request);

        $courseMaterial->update($validated);

        if (isset($validated['skills'])) {
            $courseMaterial->skills()->sync($validated['skills']);
        }

        $uploadedFiles = [];
        if ($request->hasFile('files')) {
            foreach ($courseMaterial->resources as $existingResource) {
                try {
                    $accessToken = $this->getGoogleAccessToken();

                    $deleteResponse = Http::withToken($accessToken)
                        ->delete("https://www.googleapis.com/drive/v3/files/{$existingResource->fileid}");

                    $existingResource->delete();
                } catch (\Exception $e) {
                    Log::error('Failed to delete existing resource: ' . $e->getMessage());
                }
            }

            $folderName = "Course Material";
            $uploadedFiles = $this->uploadFilesToGoogleDrive($request->file('files'), $courseMaterial->id_course_material, $folderName);
        }

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course material updated successfully',
            'course_material' => $courseMaterial->load('skills', 'resources'),
            'uploaded_files' => $uploadedFiles,
        ], 200);
    }

    public function destroy($id)
    {
        $courseMaterial = CourseMaterial::findOrFail($id);

        foreach ($courseMaterial->resources as $resource) {
            try {
                $accessToken = $this->getGoogleAccessToken();
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$resource->fileid}");
                $resource->delete();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Failed to delete associated resources'], 500);
            }
        }
        $courseMaterial->delete();
        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Course material deleted successfully'
        ], 200);
    }

    public function downloadAllResources($id)
    {
        $courseMaterial = CourseMaterial::with('resources')->findOrFail($id);
        $accessToken = $this->getGoogleAccessToken();

        return response()->stream(
            function () use ($courseMaterial, $accessToken) {
                $zip = new \ZipStream\ZipStream(
                    outputName: $courseMaterial->title . '_resources.zip',
                    sendHttpHeaders: true
                );

                foreach ($courseMaterial->resources as $resource) {
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
                'Content-Disposition' => 'attachment; filename="' . $courseMaterial->title . '_resources.zip"',
            ]
        );
    }
    
}
