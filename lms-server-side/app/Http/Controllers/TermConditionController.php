<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TermCondition;

class TermConditionController extends Controller
{
    private function validateRequest(Request $request)
    {
        return $request->validate([
            'content' => 'required|string',
        ]);
    }

    public function index()
    {
        $termConditions = TermCondition::all();
        return response()->json($termConditions);
    }

    public function show($id)
    {
        $termCondition = TermCondition::findOrFail($id);
        return response()->json($termCondition);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $termCondition = TermCondition::create($validated);

        return response()->json([
            'success' => true,
            'status_code' => 201,
            'message' => 'Terms and conditions created successfully',
            'term_condition' => $termCondition,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $this->validateRequest($request);
        $termCondition = TermCondition::findOrFail($id);

        $termCondition->update($validated);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Terms and conditions updated successfully',
            'term_condition' => $termCondition,
        ], 200);
    }

    public function destroy($id)
    {
        $termCondition = TermCondition::findOrFail($id);
        $termCondition->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Terms and conditions deleted successfully'
        ], 200);
    }

    public function getTermCondition()
    {
        $termCondition = TermCondition::first();

        if ($termCondition) {
            return response()->json($termCondition);
        } else {
            return response()->json([
                'success' => false,
                'status_code' => 404,
                'message' => 'No Terms and Conditions data found'
            ], 404);
        }
    }

    public function updateTermCondition(Request $request)
    {
        $validatedData = $this->validateRequest($request);
        $termCondition = TermCondition::firstOrCreate([]);
        $termCondition->update($validatedData);

        return response()->json([
            'message' => 'Terms and conditions updated successfully',
            'term_condition' => $termCondition
        ]);
    }
}
