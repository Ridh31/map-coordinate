<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DriverTrackingController extends Controller
{
    public function trackDriver(Request $request)
    {

        // $route = "http://127.0.0.1:8000/api/calculate-distancee?lat1=11.621040&lon1=104.892002&lat2=11.509737&lon2=105.04886";
        // $response = Http::get($route);
        // dd($response);

        return view("trackDriver");
    }

    public function mapLine(Request $request)
    {

        // $route = "http://127.0.0.1:8000/api/calculate-distancee?lat1=11.621040&lon1=104.892002&lat2=11.509737&lon2=105.04886";
        // $response = Http::get($route);
        // dd($response);

        return view("mapp");
    }
    public function geoapifyMap(Request $request)
    {

        // $route = "http://127.0.0.1:8000/api/calculate-distancee?lat1=11.621040&lon1=104.892002&lat2=11.509737&lon2=105.04886";
        // $response = Http::get($route);
        // dd($response);

        return view("geoapify");
    }
}
