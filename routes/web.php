<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;
use App\Http\Controllers\DriverTrackingController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [MapController::class, 'index']);
Route::get('/track-driver', [DriverTrackingController::class, 'trackDriver']);
Route::get('/mapLine', [DriverTrackingController::class, 'mapLine']);
Route::get('/geoapify', [DriverTrackingController::class, 'geoapifyMap']);
