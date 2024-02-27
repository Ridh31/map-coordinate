<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OverpassController extends Controller
{
    public function getData()
    {
        // Define your Overpass query
        // $overpassQuery = '[out:json];node(11.621131780711824, 104.89204823970795,11.605428275475324,104.8901232506958);out;';
        $overpassQuery = '[out:json];
        node(around:1000,51.509, -0.126);
        out;';

        // Make an HTTP request to the Overpass API
        $response = Http::get('https://overpass-api.de/api/interpreter', [
            'data' => $overpassQuery,
        ]);

        // Decode the JSON response
        $data = $response->json();

        // Process and return the data
        return response()->json($data);
    }
}
