<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-API-KEY');
        $expectedApiKey = config('services.integration_api_key');

        if (!$apiKey || $apiKey !== $expectedApiKey) {
            return response()->json(['message' => 'Unauthorized: API Key missing or invalid.'], 401);
        }

        return $next($request);
    }
}
