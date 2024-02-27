<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\responseController;
use App\Models\polylinModel;
use Carbon\Carbon;

class PolylineController extends Controller
{
    public function calculateDistancee(Request $request)
    {
        // Example coordinates (replace with your polyline points)
        
        $lat1   = $request->lat1??null;
        $lon1   = $request->lon1??null;
        $lat2   = $request->lat2??null;
        $lon2   = $request->lon2??null;
        
        $coordinates = [
                        ['lat' => $lat1, 'lon' => $lon1 ], 
                        ['lat' => $lat2 , 'lon' => $lon2], 
                            // Add more points as needed
                       ];
                    //    dd($coordinates);
                    //    $coordinates = [
                    //     ['lat' => 37.7749, 'lon' => -122.4194], // Example point 1
                    //     ['lat' => 34.0522, 'lon' => -118.2437], // Example point 2
                    //         // Add more points as needed
                    //    ];
        $totalDistance = 0;

        for ($i = 0; $i < count($coordinates) - 1; $i++) {
            $lat1 = $coordinates[$i]['lat'];
            $lon1 = $coordinates[$i]['lon'];
            $lat2 = $coordinates[$i + 1]['lat'];
            $lon2 = $coordinates[$i + 1]['lon'];

            $totalDistance += $this->haversine($lat1, $lon1, $lat2, $lon2);
        }

        // $message =  "Total Distance: " . $totalDistance . " km";
        // return responseController::success($message);
        $averageSpeed = 50; // Replace with your estimated speed in km/h
        $totalTime = $this->calculateTime($totalDistance, $averageSpeed);
        
        // dd($totalTime);
        return response()->json(['distance' => $totalDistance, 'time' => $totalTime]);
    }

    public function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Earth radius in kilometers

        $dlat = self::deg2rad($lat2 - $lat1);
        $dlon = self::deg2rad($lon2 - $lon1);

        $a = sin($dlat / 2) * sin($dlat / 2) + 
                    cos(self::deg2rad($lat1)) * cos(self::deg2rad($lat2)) * 
                    sin($dlon / 2) * sin($dlon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c;

        return $distance;
    }
    public function deg2rad($deg)
    {
        return $deg * (pi() / 180);
    }
    private function calculateTime($distance, $speed)
    {
        $time = $distance / $speed;

        return $time;
    }
    public function geoapifyMap(Request $request)
    {
        $result = polylinModel::geoapifyDataMap();
        return $result;
    }


}
