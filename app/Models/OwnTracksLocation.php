<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OwnTracksLocation extends Model
{
    protected $fillable = ['latitude', 'longitude', 'timestamp'];

    public static function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
       
        $earthRadius = 6371; // Radius of the Earth in kilometers
        // dd($earthRadius);
        $latDiff = deg2rad($lat2 - $lat1);
        $lonDiff = deg2rad($lon2 - $lon1);

        $a = sin($latDiff / 2) * sin($latDiff / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDiff / 2) * sin($lonDiff / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c;

        return $distance;
    }
    public static function ownTrackLocation($request)
    {
        $lat    =  $request->lat;
        $lon    =  $request->lon;
        $result = DB::select("SELECT insert_own_tracks_locations(?,?)",[$lat,$lon]);
        return $result;
    }
    public static function indexLocation()
    {
        $result = DB::select("SELECT * from own_tracks_locations ORDER BY id DESC");
        return $result;
    }
}