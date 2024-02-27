<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class DistanceController extends Controller
{
    public function getCoordinates($place)
    {
        // Construct the Overpass QL query to get the coordinates of a place
        $overpassQuery = "[out:json]; node['name'='$place']; out;";
        // $overpassQuery = "[out:json][timeout:25];
        //                         nwr['tourism'='$place']({{bbox}});
        //                         out geom;";
        
        // $overpassQuery = "[out:json] [timeout:90]; ( way( 30.626917110746, -96.348809105664, 30.634468750236, -96.339893442898 );); out geom;";
        // $overpassQuery = "[bbox:30.618338,-96.323712,30.591028,-96.330826] [out:json] [timeout:90]; ( way( 30.626917110746, -96.348809105664, 30.634468750236, -96.339893442898 );); out geom;";

        // Make an HTTP request to the Overpass API
        $response = Http::get('https://overpass-api.de/api/interpreter', [
            'data' => $overpassQuery,
        ]);

        // Decode the JSON response
        $data = $response->json();

        // Extract coordinates (latitude and longitude) from the Overpass API response
        // $coordinates = [
        //     'latitude' => $data['elements'][0]['lat'] ?? null,
        //     'longitude' => $data['elements'][0]['lon'] ?? null,
        // ];

        return $data;
    }

    public function calculateDistance($placeA, $placeB)
    {
        // dd($placeA, $placeB);
        // Get coordinates for Place A
        $coordinatesA = $this->getCoordinates($placeA);
        // dd($coordinatesA);
        // Get coordinates for Place B
        $coordinatesB = $this->getCoordinates($placeB);

        // Calculate the distance using the Haversine formula
        $distance = $this->haversineDistance(
            $coordinatesA['latitude'],
            $coordinatesA['longitude'],
            $coordinatesB['latitude'],
            $coordinatesB['longitude']
        );

        return response()->json(['distance' => $distance]);
    }

    // Haversine formula to calculate distance between two points
    public function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        // $lat1 = 12.9714; // Latitude of Point A
        // $lon1 = 77.5946; // Longitude of Point A

        // $lat2 = 13.0827; // Latitude of Point B
        // $lon2 = 80.2707; // Longitude of Point B
        $earthRadius = 6371; // Radius of the Earth in kilometers
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c; // Distance in kilometers
        // dd($distance);  
       

// $distance = haversineDistance($lat1, $lon1, $lat2, $lon2);
        return $distance;
    }
}
