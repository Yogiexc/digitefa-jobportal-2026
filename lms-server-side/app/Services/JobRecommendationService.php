<?php

namespace App\Services;

use App\JobPortal\ExperienceRequirement;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

class JobRecommendationService
{
    protected $baseUrl = 'https://api-portal.digitefa.id/api';
    protected const CACHE_TTL = 3600;

    public function getJobsBySkillPoints(array $skillPointsData, int $page = 1, int $size = 10)
    {
        $categories = collect($skillPointsData['categories'])
            ->sortByDesc('total_points')
            ->values();

        $totalPoints = $skillPointsData['total_points'];

        // Periksa apakah total poin kurang dari 145
        if ($totalPoints < 145) {
            return [
                'totalData' => 0,
                'totalPages' => 0,
                'currentPage' => $page,
                'size' => $size,
                'recommended_experience_level' => null,
                'total_skill_points' => $totalPoints,
                'data' => [],
                'message' => 'Total points are less than the minimum required for job recommendations.'
            ];
        }

        $experienceLevel = ExperienceRequirement::getByPoints($totalPoints);

        $allJobs = $this->fetchAndProcessJobs($categories, $experienceLevel);

        $paginatedJobs = $this->paginateJobs($allJobs, $page, $size);

        return [
            'totalData' => count($allJobs),
            'totalPages' => ceil(count($allJobs) / $size),
            'currentPage' => $page,
            'size' => $size,
            'recommended_experience_level' => $experienceLevel,
            'total_skill_points' => $totalPoints,
            'data' => $paginatedJobs
        ];
    }

    private function fetchAndProcessJobs(Collection $categories, string $experienceLevel): array
    {
        $processedJobs = [];
        $allJobs = [];

        foreach ($categories as $category) {
            $categoryJobs = $this->searchJobs($category['name']);
            $this->processJobResults($categoryJobs, $category, $experienceLevel, $processedJobs, $allJobs, 'category');

            foreach ($category['skills'] as $skill) {
                $skillJobs = $this->searchJobs($skill['name']);
                $this->processJobResults($skillJobs, $category, $experienceLevel, $processedJobs, $allJobs, 'skill', $skill);
            }
        }

        return collect($allJobs)
            ->sortByDesc('matching_score')
            ->values()
            ->all();
    }

    private function searchJobs(string $searchTerm): array
    {
        $cacheKey = "jobs_search_" . md5($searchTerm);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($searchTerm) {
            $response = Http::get("{$this->baseUrl}/jobs-search", [
                'search' => trim($searchTerm)
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                if (isset($responseData['data'])) {
                    return $responseData['data'];
                }
            }

            return [];
        });
    }

    private function processJobResults(
        array $jobs,
        array $category,
        string $experienceLevel,
        array &$processedJobs,
        array &$allJobs,
        string $matchType,
        ?array $skill = null
    ): void {
        foreach ($jobs as $job) {
            if (!isset($processedJobs[$job['job_id']])) {
                $matchingScore = $this->calculateMatchingScore($job, $category, $experienceLevel, $matchType, $skill);

                if ($matchingScore > 0) {
                    $job['matching_score'] = $matchingScore;
                    $job['matching_category'] = $category['name'];
                    $job['matching_type'] = $matchType;
                    if ($skill) {
                        $job['matching_skill'] = $skill['name'];
                    }
                    $allJobs[] = $job;
                    $processedJobs[$job['job_id']] = true;
                }
            } else {
                $existingJobKey = array_search($job['job_id'], array_column($allJobs, 'job_id'));
                if ($existingJobKey !== false) {
                    $newScore = $this->calculateMatchingScore($job, $category, $experienceLevel, $matchType, $skill);
                    if ($newScore > $allJobs[$existingJobKey]['matching_score']) {
                        $allJobs[$existingJobKey]['matching_score'] = $newScore;
                        $allJobs[$existingJobKey]['matching_type'] = $matchType;
                        if ($skill) {
                            $allJobs[$existingJobKey]['matching_skill'] = $skill['name'];
                        }
                    }
                }
            }
        }
    }

    private function calculateMatchingScore(
        $job,
        $category,
        $studentExperienceLevel,
        string $matchType,
        ?array $skill = null
    ): float {
        $score = 0;

        $score += $category['total_points'];

        $jobExperience = $job['experience_requirement'];
        $experiencePoints = $this->calculateExperienceMatch($jobExperience, $studentExperienceLevel);
        $score += $experiencePoints;

        if ($matchType === 'category') {
            if (stripos($job['category'], $category['name']) !== false) {
                $score += 50;
            }
        } else if ($matchType === 'skill' && $skill) {
            if (stripos($job['title'], $skill['name']) !== false) {
                $score += 75;
            }
            $score += $skill['point'];
        }

        $titleRelevance = $this->calculateTitleRelevance($job['title'], $category, $skill);
        $score += $titleRelevance;

        return $score;
    }

    private function calculateTitleRelevance(string $title, array $category, ?array $skill = null): float
    {
        $relevanceScore = 0;

        if (stripos($title, $category['name']) !== false) {
            $relevanceScore += 20;
        }

        if ($skill && stripos($title, $skill['name']) !== false) {
            $relevanceScore += 30;
        }

        return $relevanceScore;
    }

    private function calculateExperienceMatch(string $jobExperience, string $studentExperienceLevel): int
    {
        $experiencePoints = ExperienceRequirement::getMinimumPoints();

        $jobPoints = $experiencePoints[$jobExperience] ?? 0;
        $studentPoints = $experiencePoints[$studentExperienceLevel] ?? 0;

        $difference = abs($jobPoints - $studentPoints);

        if ($difference <= 145) {
            return 100;
        } elseif ($difference <= 290) {
            return 50;
        } elseif ($difference <= 435) {
            return 25;
        }

        return 0;
    }

    private function paginateJobs(array $jobs, int $page, int $size): array
    {
        $offset = ($page - 1) * $size;

        return array_slice($jobs, $offset, $size);
    }
}
