<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SkillPointService;
use App\Models\Student;

class SkillPointController extends Controller
{
    protected $skillPointService;

    public function __construct(SkillPointService $skillPointService)
    {
        $this->skillPointService = $skillPointService;
    }

    private function getStudentIdByUserId($id_user)
    {
        $student = Student::where('id_user', $id_user)->firstOrFail();
        return $student->id_student;
    }

    public function getStudentSkillPoints($id_user)
    {
        $studentId = $this->getStudentIdByUserId($id_user);
        $skillPoints = $this->skillPointService->getStudentSkillPoints($studentId);
        return response()->json([
            'success' => true,
            'data' => $skillPoints
        ]);
    }

    public function getSkillPointHistory($id_user, $skillId = null)
    {
        $studentId = $this->getStudentIdByUserId($id_user);
        $history = $this->skillPointService->getSkillPointHistory($studentId, $skillId);
        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    public function getStudentSkillPointsWithCategories($id_user)
    {
        try {
            $studentId = $this->getStudentIdByUserId($id_user);
            $result = $this->skillPointService->getStudentSkillPointsWithCategories($studentId);

            return response()->json([
                'success' => true,
                'message' => 'Student skill points retrieved successfully',
                'data' => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve student skill points',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}