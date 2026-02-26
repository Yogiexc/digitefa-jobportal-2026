<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GdriveController extends Controller
{
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
}
