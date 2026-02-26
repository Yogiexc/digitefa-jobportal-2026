<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use App\Models\QuizQuestionResource;
use App\Models\QuizOptionResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QuizQuestionController extends Controller
{
    private function validateQuestion(Request $request)
    {
        return $request->validate([
            'id_quiz' => 'required|exists:quizzes,id_quiz',
            'question' => 'required|string',
            'type' => 'required|in:single_choice,multiple_choice,essay',
            'files.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,word,zip,rar',
            'options' => 'array|nullable',
            'options.*.answer' => 'string|nullable',
            'options.*.is_correct' => 'boolean|nullable',
            'options.*.files.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,doc,docx,txt,word,zip,rar',
            'reference_answer' => 'string|nullable',
        ]);
    }

    public function index($id_quiz)
    {
        $questions = QuizQuestion::with(['options.resources', 'resources'])
            ->where('id_quiz', $id_quiz)
            ->get();
        return response()->json($questions);
    }

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $this->validateQuestion($request);

            $question = QuizQuestion::create([
                'id_quiz' => $validated['id_quiz'],
                'question' => $validated['question'],
                'type' => $validated['type'],
            ]);

            $uploadedQuestionFiles = [];
            if ($request->hasFile('files')) {
                $folderName = "Quiz Question Resources";
                $uploadedQuestionFiles = $this->uploadFilesToGoogleDrive($request->file('files'), $question->id_quiz_question, $folderName, 'question');
            }

            $uploadedOptionFiles = [];
            if (in_array($question->type, ['single_choice', 'multiple_choice']) && isset($validated['options'])) {
                $options = [];
                foreach ($validated['options'] as $index => $optionData) {
                    $option = new QuizOption([
                        'answer' => $optionData['answer'] ?? null,
                        'is_correct' => $optionData['is_correct'] ?? false,
                        'type' => $question->type,
                    ]);
                    $question->options()->save($option);

                    if ($request->hasFile("options.{$index}.files")) {
                        $optionFiles = $request->file("options.{$index}.files");
                        $folderName = "Quiz Option Resources";
                        $uploadedOptionFiles[$option->id_quiz_option] = $this->uploadFilesToGoogleDrive(
                            $optionFiles,
                            $option->id_quiz_option,
                            $folderName,
                            'option'
                        );
                    }
                }
            } elseif ($question->type === 'essay' && isset($validated['reference_answer'])) {
                $option = $question->options()->create([
                    'type' => 'essay',
                    'reference_answer' => $validated['reference_answer'],
                ]);
            }

            return response()->json([
                'success' => true,
                'status_code' => 201,
                'message' => 'Question created successfully',
                'question' => $question->load('options.resources', 'resources'),
                'uploaded_question_files' => $uploadedQuestionFiles,
                'uploaded_option_files' => $uploadedOptionFiles,
            ], 201);
        });
    }

    public function update(Request $request, $id_question)
    {
        return DB::transaction(function () use ($request, $id_question) {
            $question = QuizQuestion::findOrFail($id_question);
            $validated = $this->validateQuestion($request);

            foreach ($question->options as $existingOption) {
                foreach ($existingOption->resources as $optionResource) {
                    try {
                        $accessToken = $this->getGoogleAccessToken();
                        Http::withToken($accessToken)
                            ->delete("https://www.googleapis.com/drive/v3/files/{$optionResource->fileid}");
                        $optionResource->delete();
                    } catch (\Exception $e) {
                        Log::error('Failed to delete existing option resource: ' . $e->getMessage());
                    }
                }
            }

            $question->options()->delete();

            $question->update([
                'question' => $validated['question'],
                'type' => $validated['type'],
            ]);

            foreach ($question->resources as $existingResource) {
                try {
                    $accessToken = $this->getGoogleAccessToken();
                    Http::withToken($accessToken)
                        ->delete("https://www.googleapis.com/drive/v3/files/{$existingResource->fileid}");
                    $existingResource->delete();
                } catch (\Exception $e) {
                    Log::error('Failed to delete existing question resource: ' . $e->getMessage());
                }
            }

            $uploadedQuestionFiles = [];
            if ($request->hasFile('files')) {
                $folderName = "Quiz Question Resources";
                $uploadedQuestionFiles = $this->uploadFilesToGoogleDrive($request->file('files'), $question->id_quiz_question, $folderName, 'question');
            }

            $uploadedOptionFiles = [];
            if (in_array($question->type, ['single_choice', 'multiple_choice']) && isset($validated['options'])) {
                foreach ($validated['options'] as $index => $optionData) {
                    $option = new QuizOption([
                        'answer' => $optionData['answer'] ?? null,
                        'is_correct' => $optionData['is_correct'] ?? false,
                        'type' => $question->type,
                    ]);
                    $question->options()->save($option);

                    if ($request->hasFile("options.{$index}.files")) {
                        $optionFiles = $request->file("options.{$index}.files");
                        $folderName = "Quiz Option Resources";
                        $uploadedOptionFiles[$option->id_quiz_option] = $this->uploadFilesToGoogleDrive(
                            $optionFiles,
                            $option->id_quiz_option,
                            $folderName,
                            'option'
                        );
                    }
                }
            } elseif ($question->type === 'essay' && isset($validated['reference_answer'])) {
                $question->options()->create([
                    'type' => 'essay',
                    'reference_answer' => $validated['reference_answer'],
                ]);
            }

            $question = $question->fresh(['options.resources', 'resources']);

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Question updated successfully',
                'question' => $question,
                'uploaded_question_files' => $uploadedQuestionFiles,
                'uploaded_option_files' => $uploadedOptionFiles,
            ], 200);
        });
    }

    public function destroy($id_question)
    {
        return DB::transaction(function () use ($id_question) {
            $question = QuizQuestion::findOrFail($id_question);

            foreach ($question->resources as $resource) {
                try {
                    $accessToken = $this->getGoogleAccessToken();
                    Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$resource->fileid}");
                    $resource->delete();
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Failed to delete associated resources'], 500);
                }
            }

            $question->delete();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Question deleted successfully',
            ], 200);
        });
    }

    public function downloadAllResources($id_question)
    {
        $question = QuizQuestion::with('resources')->findOrFail($id_question);
        $accessToken = $this->getGoogleAccessToken();

        $zipFileName = $question->id_quiz_question . '_resources.zip';

        $tempZipPath = storage_path('app/temp/' . $zipFileName);
        $zip = new \ZipArchive();

        if ($zip->open($tempZipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            foreach ($question->resources as $resource) {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $accessToken,
                ])->get("https://www.googleapis.com/drive/v3/files/{$resource->fileid}?alt=media");

                if ($response->successful()) {
                    $zip->addFromString($resource->name, $response->body());
                } else {
                    Log::error("Failed to retrieve file: {$resource->name} (ID: {$resource->fileid})");
                }
            }

            $zip->close();
        } else {
            return response()->json(['error' => 'Failed to create ZIP archive'], 500);
        }

        return response()->download($tempZipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    private function uploadFilesToGoogleDrive($files, $id, $folderName, $resourceType = 'question')
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

                if ($resourceType === 'question') {
                    $uploadedFile = new QuizQuestionResource;
                    $uploadedFile->id_quiz_question = $id;
                } else {
                    $uploadedFile = new QuizOptionResource;
                    $uploadedFile->id_quiz_option = $id;
                }

                $uploadedFile->name = $name;
                $uploadedFile->fileid = $fileId;
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
}
