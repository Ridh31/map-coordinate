<?php

namespace App\Models;

use App\Events\DriverLocationUpdated;
use App\Http\Controllers\responseController;
use GuzzleHttp\Psr7\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Driver extends Model
{
    public static function getDriver($latitude,$longitude)
    {
        $result = DB::table('own_tracks_locations')->insert([
            'lat' => $latitude ,
            'lon' => $longitude
            // Add more columns and values as needed
        ]);
        broadcast(new DriverLocationUpdated($latitude,$longitude))->toOthers();
        // dd($result);
        return responseController::success($result);
    }
}
