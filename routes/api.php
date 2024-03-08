<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DistanceController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\OverpassController;
use App\Http\Controllers\OwnTracksController;
use App\Http\Controllers\PolylineController;
use App\Http\Controllers\DriverTrackingController;
use App\Listeners\DriverLocationUpdatedListener;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/coordinates/{place}', [DistanceController::class, 'getCoordinates']);
Route::get('/calculate-distance/{placeA}/{placeB}', [DistanceController::class, 'calculateDistance']);
Route::get('/api/get-data', [MapController::class, 'getData']);

Route::get('/owntracks/distance/{locationId1}/{locationId2}', [OwnTracksController::class, 'calculateDistance']);
Route::get('/overpass-data', [OverpassController::class, 'getData']);
Route::get('/calculate-distancee', [PolylineController::class, 'calculateDistancee']);
Route::post('/owntracks/location', [OwnTracksController::class, 'receiveLocation']);
Route::get('/owntracks/location', [OwnTracksController::class, 'indexLocation']);
Route::get('/geoapify', [PolylineController::class, 'geoapifyMap']);
Route::post('update-driver-location', [OwnTracksController::class, 'insertLocation']);


