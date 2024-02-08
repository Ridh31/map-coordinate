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
}