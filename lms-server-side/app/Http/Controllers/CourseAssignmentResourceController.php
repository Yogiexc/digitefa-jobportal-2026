<?php

namespace App\Http\Controllers;

use App\Models\CourseAssignmentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class CourseAssignmentResourceController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'files.*' => 'required|file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,word,zip,rar|max:10240', // Max 10MB
            'id_course_assignment' => 'required|exists:course_assignments,id_course_assignment',
        ]);
    }

    public function token()
    {
        $client_id = \Config('services.google.client_id');
        $client_secret = \Config('services.google.client_secret');
        $refresh_token = \Config('services.google.refresh_token');
        $folder_id = \Config('services.google.folder_id');

        $response = Http::post('https://oauth2.googleapis.com/token', [
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'refresh_token' => $refresh_token,
            'grant_type' => 'refresh_token',
        ]);

        $accessToken = json_decode((string) $response->getBody(), true)['access_token'];

        return $accessToken;
    }

    public function store(Request $request)
    {
        $validatedData = $this->validateRequest($request);
        $accessToken = $this->token();
        $mainFolderId = \Config('services.google.folder_id');

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $name = $file->getClientOriginalName();
            $path = $file->getRealPath();

            $fileContent = file_get_contents($path);
            $fileSize = filesize($path);

            try {
                $folderCheckResponse = Http::withToken($accessToken)
                    ->get('https://www.googleapis.com/drive/v3/files', [
                        'q' => "name = 'Course Assignment Resources' and '{$mainFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
                        'fields' => 'files(id, name)'
                    ]);

                if (!$folderCheckResponse->successful()) {
                    return response('Failed to check for Course Assignment folder in Google Drive: ' . $folderCheckResponse->body(), 500);
                }

                $files = json_decode($folderCheckResponse->body())->files;
                $courseAssignmentFolderId = $files[0]->id ?? null;

                if (!$courseAssignmentFolderId) {
                    $folderCreateResponse = Http::withToken($accessToken)
                        ->withHeaders(['Content-Type' => 'application/json; charset=UTF-8'])
                        ->post('https://www.googleapis.com/drive/v3/files', [
                            'name' => 'Course Assignment Resources',
                            'mimeType' => 'application/vnd.google-apps.folder',
                            'parents' => [$mainFolderId],
                        ]);

                    if (!$folderCreateResponse->successful()) {
                        return response('Failed to create Course Assignment folder in Google Drive: ' . $folderCreateResponse->body(), 500);
                    }

                    $courseAssignmentFolderId = json_decode($folderCreateResponse->body())->id;
                }

                $metadata = [
                    'name' => mb_convert_encoding($name, 'UTF-8', 'auto'),
                    'parents' => [$courseAssignmentFolderId]
                ];

                $metadataResponse = Http::withToken($accessToken)
                    ->withHeaders(['Content-Type' => 'application/json; charset=UTF-8'])
                    ->post('https://www.googleapis.com/drive/v3/files', $metadata);

                if (!$metadataResponse->successful()) {
                    return response('Failed to create file metadata in Google Drive: ' . $metadataResponse->body(), 500);
                }

                $fileId = json_decode($metadataResponse->body())->id;

                $contentResponse = Http::withToken($accessToken)
                    ->withHeaders([
                        'Content-Type' => $file->getMimeType(),
                        'Content-Length' => $fileSize
                    ])
                    ->withBody($fileContent, $file->getMimeType())
                    ->patch("https://www.googleapis.com/upload/drive/v3/files/{$fileId}?uploadType=media");

                if ($contentResponse->successful()) {
                    $uploadedfile = new CourseAssignmentResource;
                    $uploadedfile->name = mb_convert_encoding($name, 'UTF-8', 'auto');
                    $uploadedfile->fileid = $fileId;
                    $uploadedfile->id_course_assignment = $validatedData['id_course_assignment'];
                    $uploadedfile->save();

                    $uploadedFiles[] = $uploadedfile;
                } else {
                    return response('Failed to Upload Content to Google Drive: ' . $contentResponse->body(), 500);
                }
            } catch (\Exception $e) {
                return response('Upload Error: ' . $e->getMessage(), 500);
            }
        }

        return response()->json([
            'message' => 'Files Uploaded to Google Drive',
            'files' => $uploadedFiles
        ]);
    }

    public function download($id)
    {
        $file = CourseAssignmentResource::findOrFail($id);
        $accessToken = $this->token();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get("https://www.googleapis.com/drive/v3/files/{$file->fileid}?alt=media");

        if ($response->successful()) {
            return response()->streamDownload(function () use ($response) {
                echo $response->body();
            }, $file->name, [
                'Content-Type' => $response->header('Content-Type'),
            ]);
        } else {
            return response()->json(['error' => 'Failed to retrieve file'], 500);
        }
    }

    public function show($id)
    {
        $accessToken = $this->token();

        $response = Http::withToken($accessToken)
            ->get("https://www.googleapis.com/drive/v3/files/{$id}", [
                'fields' => 'id, name, mimeType, size, createdTime, modifiedTime'
            ]);

        if ($response->successful()) {
            return response()->json(json_decode($response->body()), 200);
        }

        return response()->json(['error' => 'File not found'], 404);
    }

    public function destroy(string $id)
    {
        try {
            $file = CourseAssignmentResource::findOrFail($id);
            $accessToken = $this->token();

            $response = Http::withToken($accessToken)
                ->delete("https://www.googleapis.com/drive/v3/files/{$file->fileid}");

            $file->delete();

            return response()->json([
                'message' => 'File deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function preview($id)
    {
        $file = CourseAssignmentResource::findOrFail($id);
        $accessToken = $this->token();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get("https://www.googleapis.com/drive/v3/files/{$file->fileid}?alt=media");

        if ($response->successful()) {
            return response($response->body(), 200, [
                'Content-Type' => $response->header('Content-Type'),
                'Content-Disposition' => 'inline',
            ]);
        }

        return response()->json(['error' => 'Failed to retrieve file'], 500);
    }
}
