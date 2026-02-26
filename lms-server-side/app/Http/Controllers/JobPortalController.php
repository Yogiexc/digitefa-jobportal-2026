<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\JobRecommendationService;
use App\Http\Controllers\SkillPointController;
use Illuminate\Support\Facades\Log;

class JobPortalController extends Controller
{
    protected $jobRecommendationService;
    protected $skillPointController;

    public function __construct(
        JobRecommendationService $jobRecommendationService,
        SkillPointController $skillPointController
    ) {
        $this->jobRecommendationService = $jobRecommendationService;
        $this->skillPointController = $skillPointController;
    }

    public function getRecommendedJobs(Request $request, $id_user)
    {
        try {
            Log::info('Getting skill points for user', ['id_user' => $id_user]);

            // Get the response from skill points controller
            $response = $this->skillPointController->getStudentSkillPointsWithCategories($id_user);

            // Convert response to array
            $studentSkillPoints = json_decode($response->getContent(), true);

            Log::debug('Skill points response after parsing', ['data' => $studentSkillPoints]);

            // Check if the response structure is valid
            if (!$studentSkillPoints['success'] || !isset($studentSkillPoints['data'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid skill points data structure',
                    'error' => 'Missing data in skill points response'
                ], 400);
            }

            $recommendedJobs = $this->jobRecommendationService->getJobsBySkillPoints(
                $studentSkillPoints['data'],
                $request->query('page', 1),
                $request->query('size', 10)
            );

            return response()->json([
                'success' => true,
                'message' => 'Recommended jobs retrieved successfully',
                'data' => $recommendedJobs
            ], 200);
        } catch (\Exception $e) {
            Log::error('Job recommendation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve recommended jobs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
