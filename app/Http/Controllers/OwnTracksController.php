<?php

// app/Http/Controllers/OwnTracksController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OwnTracksLocation; // Replace with your own model
use Illuminate\Support\Facades\DB;

class OwnTracksController extends Controller
{
    public function receiveLocation(Request $request)
    {
        // Validate and process OwnTracks location update
        // $data = $request->all();
        
        // dd($data);
        // Store OwnTracks location data in the database
        $result = OwnTracksLocation::ownTrackLocation($request);
        // $result = DB::select("INSERT INTO  own_tracks_locations where lat = '$lat' and lon = '$lon'");
            // 'timestamp' => $data['tst'],
            // Add other relevant fields    
            // dd($data);
            // 'lat' => $lat[0]['lat']?? null,
            // 'lon' => $lon[0]['lon']?? null,
        // );
        
        // $results = DB::table('own_tracks_locations')
        // ->where('lat', '=', $data)
        // ->get();
        // dd($results);

        // return response()->json(['message' => 'Location update received successfully']);
        return $result;
    }
    public function indexLocation()
    {
        $result = OwnTracksLocation::indexLocation();
        return $result;
    }
    public function calculateDistance($locationId1, $locationId2)
    {
        
        $location1 = OwnTracksLocation::findOrFail($locationId1);
        // dd($location1);
        $location2 = OwnTracksLocation::findOrFail($locationId2);
        // dd($location1);
        $distance = OwnTracksLocation::calculateDistance(
                                $location1->latitude,
                                $location1->longitude,
                                $location2->latitude,
                                $location2->longitude
                            );
                            // dd($distance);

        return "The distance between locations is approximately {$distance} kilometers.";
        // dd($distance);
        // return $distance;
    }
}
