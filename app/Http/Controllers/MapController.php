<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapController extends Controller
{
    public function index()
    {
        $initialMarkers = [
            [
                'position' => [
                    'lat' => 11.562108,
                    'lng' => 104.888535
                ],
                'draggable' => true
            ],
        ];
        return view('map.map', compact('initialMarkers'));
    }
    public function getData()
    {
        // Your logic to fetch data from the database or any other source
        $data = [
            ['lat' => 40.7128, 'lng' => -74.0060, 'name' => 'New York'],
            ['lat' => 34.0522, 'lng' => -118.2437, 'name' => 'Los Angeles'],
            // Add more data as needed
        ];

        return response()->json(['data' => $data]);
    }
    // public function index()
    // {
    //     return view('mapp.index');
    // }
}