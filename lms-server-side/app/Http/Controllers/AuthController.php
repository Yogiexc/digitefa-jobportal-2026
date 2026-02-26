<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\EmailVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Exception;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use PHPUnit\Event\Code\Throwable;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'email' => ['required', 'email', Rule::unique('users')],
            'password' => 'required|string|min:8|confirmed',
            'name' => 'required|string|max:255',
            'role' => ['required', Rule::in(['student', 'teacher', 'admin'])],
        ]);

        try {
            DB::beginTransaction();

            $existingVerification = EmailVerification::where('email', $request->email)
                ->where('expires_at', '>', Carbon::now())
                ->first();

            if ($existingVerification) {
                return response()->json([
                    'success' => false,
                    'status_code' => 400,
                    'message' => 'Email verification code is still valid. Please verify your email.'
                ], 400);
            }

            $unverifiedUser = User::where('email', $request->email)
                ->where('is_verified', false)
                ->first();

            if ($unverifiedUser) {
                $unverifiedUser->delete();
            }

            $isVerified = $request->role === 'admin' ? true : false;

            $user = User::create([
                'email' => $request->email,
                'name' => $request->name,
                'role' => $request->role,
                'password' => Hash::make($request->password),
                'is_verified' => $isVerified,
            ]);

            if ($user->role === 'student') {
                Student::create([
                    'id_user' => $user->id_user,
                ]);
            } elseif ($user->role === 'teacher') {
                Teacher::create([
                    'id_user' => $user->id_user,
                    'id_teacher_level' => 1,
                ]);
            }

            $verificationCode = $this->sendVerificationCode($request->email);

            DB::commit();

            return response()->json([
                'success' => true,
                'status_code' => 201,
                'message' => 'Registration successful. Please verify your email.',
                'user' => $user,
                'verification_code' => $verificationCode,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function sendVerificationCode($email)
    {
        $verificationCode = rand(1000, 9999);

        EmailVerification::updateOrCreate(
            ['email' => $email],
            [
                'verification_code' => $verificationCode,
                'expires_at' => Carbon::now()->addMinutes(5),
            ]
        );

        Mail::send('emails.verify-email', ['code' => $verificationCode], function ($message) use ($email) {
            $message->to($email)
                ->subject('Email Verification Code');
        });

        return $verificationCode;
    }

    public function resendVerificationCode(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validatedData->fails()) {
            return response()->json(['errors' => $validatedData->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'status_code' => 404,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->is_verified) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'User already verified.',
            ], 400);
        }

        $this->sendVerificationCode($user->email);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Verification code resent. Please check your email.',
        ], 200);
    }

    public function verifyEmail(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'email' => 'required|email',
            'verification_code' => 'required|digits:4',
        ]);

        if ($validatedData->fails()) {
            return response()->json(['errors' => $validatedData->errors()], 422);
        }

        $emailVerification = EmailVerification::where('email', $request->email)
            ->where('verification_code', $request->verification_code)
            ->first();

        if (!$emailVerification) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'Invalid verification code.',
            ], 400);
        }

        if (Carbon::now()->greaterThan($emailVerification->expires_at)) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'Verification code has expired. Please request a new code.',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['is_verified' => true]);

        $emailVerification->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Email verified successfully.',
        ], 200);
    }

    public function login(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'remember_me' => 'sometimes|boolean',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'success' => false,
                'status_code' => 422,
                'message' => 'Unprocessable content',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'status_code' => 401,
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (!$user->is_verified) {
            return response()->json([
                'success' => false,
                'status_code' => 403,
                'message' => 'Your email is not verified. Please verify your email to login.',
            ], 403);
        }

        $expiration = $request->remember_me ? Carbon::now()->addDays(2) : Carbon::now()->addDay();
        $token = $user->createToken('AuthToken', ['*'], $expiration)->plainTextToken;

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Successfully logged out',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Failed to logout',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUser(Request $request)
    {
        $user = $request->user()->load(['student', 'teacher.teacherLevel.allowedCourseLevels', 'teacher.categoriesTeacher', 'teacher.teacherCertificates']);

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'user' => $user,
        ], 200);
    }

    public function sendResetPasswordLink(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $token = Str::random(60);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => Carbon::now()]
        );

        $resetLink = "https://dev-lms.digitefa.id/forget-password/$token";
        Mail::raw("Click here to reset your password: $resetLink", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Reset Password');
        });

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Reset password link has been sent to your email.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validatedData = $request->validate([
            'token' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $passwordReset = DB::table('password_reset_tokens')->where('token', $request->token)->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'Invalid or expired token.'
            ], 400);
        }

        $user = User::where('email', $passwordReset->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('token', $request->token)->delete();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Password has been successfully updated.'
        ]);
    }

    public function validateTokenPassword(Request $request)
    {
        $validatedData = $request->validate([
            'token' => 'required',
        ]);

        $passwordReset = DB::table('password_reset_tokens')->where('token', $request->token)->first();

        if (!$passwordReset) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'Invalid or expired token.'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Token is valid.'
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validatedData = $request->validate([
            'old_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'The old password is incorrect.'
            ], 400);
        }

        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'status_code' => 400,
                'message' => 'New password cannot be the same as the old password.'
            ], 400);
        }
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'status_code' => 200,
            'message' => 'Password has been successfully updated.'
        ]);
    }

    public function validateToken(Request $request)
    {
        if ($request->user()) {
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Token is valid.',
            ], 200);
        }
        return response()->json([
            'success' => false,
            'status_code' => 401,
            'message' => 'Invalid or expired token.',
        ], 401);
    }

    public function changePassword(Request $request)
    {
        $validatedData = $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        try {
            $user = $request->user();

            if (!Hash::check($request->old_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'status_code' => 400,
                    'message' => 'The old password you entered is incorrect.',
                ], 400);
            }

            if (Hash::check($request->new_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'status_code' => 400,
                    'message' => 'The new password cannot be the same as the old password.',
                ], 400);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Password has been successfully updated.',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Failed to update password.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function changeEmail(Request $request)
    {
        $validatedData = $request->validate([
            'password' => 'required|string',
            'new_email' => ['required', 'email', Rule::unique('users', 'email')],
        ]);

        try {
            $user = $request->user();

            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'status_code' => 400,
                    'message' => 'The password you entered is incorrect.',
                ], 400);
            }

            $user->email = $validatedData['new_email'];
            $user->save();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Email has been successfully updated.',
                'user' => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Failed to update email.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function validateCredentials(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'job_portal_id' => 'required|string|uuid',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (Auth::guard('web')->attempt($request->only('email', 'password'))) {
            /** @var User $user */
            $user = Auth::guard('web')->user();

            if ($user->job_portal_id && $user->job_portal_id !== $request->input('job_portal_id')) {
                Auth::guard('web')->logout();
                return response()->json([
                    'message' => 'This LMS account is already linked to another Job Portal account.'
                ], 409);
            }

            $user->job_portal_id = $request->input('job_portal_id');
            $user->job_portal_linked_at = Carbon::now();
            $user->save();

            Auth::guard('web')->logout();

            return response()->json([
                'message' => 'LMS User authenticated and linked successfully.',
                'user' => [
                    'id_user' => $user->id_user,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);
        }

        return response()->json(['message' => 'Invalid LMS credentials.'], 401);
    }

    public function linkAccount(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        $lmsUser = $request->user();

        $jobPortalUrl = config('services.job_portal.validate_url');
        $apiKey = config('services.job_portal.api_key');

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => $apiKey,
                'Accept' => 'application/json',
            ])->post($jobPortalUrl, [
                'email' => $request->input('email'),
                'password' => $request->input('password'),
                'lmsUserId' => $lmsUser->id_user,
            ]);

            if ($response->successful()) {
                $jobSeekerId = $response->json('data.job_seeker_id');

                if (!$jobSeekerId) {
                    Log::error('Job Portal response missing job_seeker_id', ['response' => $response->json()]);
                    return response()->json(['message' => 'Invalid response from linking service.'], 500);
                }

                $lmsUser->job_portal_id = $jobSeekerId;
                $lmsUser->job_portal_linked_at = Carbon::now();
                $lmsUser->save();

                return response()->json([
                    'message' => 'Job Portal account linked successfully!',
                    'user' => $lmsUser->fresh(),
                ]);
            }

            $errorMessage = $response->json('message', 'Failed to link account.');
            return response()->json(['message' => $errorMessage], $response->status());
        } catch (Throwable $e) {
            Log::error('Failed to connect to Job Portal service: ' . $e);
            return response()->json(['message' => 'Could not connect to the linking service.'], 503);
        }
    }

    public function unlinkAccount(Request $request)
    {
        $lmsUser = $request->user();
        $jobPortalId = $lmsUser->job_portal_id;

        if (!$jobPortalId) {
            return response()->json(['message' => 'This account is not linked.'], 404);
        }

        $jobPortalUnlinkUrl = config('services.job_portal.unlink_url');
        $apiKey = config('services.job_portal.api_key');

        if ($jobPortalUnlinkUrl && $apiKey) {
            try {
                Http::withHeaders([
                    'X-API-KEY' => $apiKey,
                    'Accept' => 'application/json',
                ])->post($jobPortalUnlinkUrl, [
                    'job_seeker_id' => $jobPortalId, 
                ]);
                Log::info("Successfully notified Job Portal to unlink account for job_seeker_id: {$jobPortalId}");
            } catch (\Exception $e) {

                Log::error("Failed to notify Job Portal to unlink account: " . $e->getMessage());
            }
        }

        $lmsUser->job_portal_id = null;
        $lmsUser->job_portal_linked_at = null; 
        $lmsUser->save();

        return response()->json([
            'message' => 'Job Portal account unlinked successfully!',
            'user' => $lmsUser->fresh(),
        ]);
    }

    public function unlinkFromJobPortal(Request $request)
    {
        $request->validate([
            'job_portal_id' => 'required|string|uuid'
        ]);

        $jobPortalId = $request->input('job_portal_id');

        $user = User::where('job_portal_id', $jobPortalId)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found or already unlinked.'], 200);
        }

        $user->job_portal_id = null;
        $user->job_portal_linked_at = null;

        $user->save();

        return response()->json(['message' => 'LMS account unlinked successfully.']);
    }
}
