<?php

namespace App\Models;

use App\Http\Controllers\responseController;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\paginationModel;
use Illuminate\Support\Facades\DB;

class polylinModel extends Model
{
    use HasFactory;
    public static function geoapifyDataMap($request)
    {
        
        $waypoints = $request->waypoints;
        $mode = $request->mode;
        $apiKey = env('GEOAPIFY_KEY');
        $route = 'https://api.geoapify.com/v1/routing?waypoints='. $waypoints. '&mode='. $mode. '&apiKey='.$apiKey;
        $curl = curl_init();
        
        curl_setopt_array($curl, 
                        array(
                            CURLOPT_URL => $route, 
                            CURLOPT_RETURNTRANSFER => true,
                            CURLOPT_ENCODING => '',
                            CURLOPT_MAXREDIRS => 10,
                            CURLOPT_TIMEOUT => 0,
                            CURLOPT_FOLLOWLOCATION => true,
                            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                            CURLOPT_CUSTOMREQUEST => 'GET',
                        ));

        $response = curl_exec($curl);

        // dd($response);
        curl_close($curl);
        return responseController::success($response) ;
            
    }
}
