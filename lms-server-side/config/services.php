<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google'=>[
        'client_id'=>env('GOOGLE_CLIENT_ID'),
        'client_secret'=>env('GOOGLE_CLIENT_SECRET'),
        'refresh_token'=>env('GOOGLE_REFRESH_TOKEN'),
        'folder_id'=>env('GOOGLE_FOLDER_ID'),
    ],

    'integration_api_key' => env('INTEGRATION_API_KEY'),

    'job_portal' => [
        'api_key' => env('INTEGRATION_API_KEY'),
        'validate_url' => env('JOB_PORTAL_VALIDATE_URL'),
        'unlink_url' => env('JOB_PORTAL_UNLINK_URL'),
    ],
];
