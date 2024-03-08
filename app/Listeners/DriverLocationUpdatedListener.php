<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\DriverLocationUpdated;
use App\Models\Driver;
use Illuminate\Support\Facades\Request;

class DriverLocationUpdatedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    // public $Driver;
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    
    public function handle()
    {
        // Update the driver's location in the database
        // Driver::where('id', $req->driverId)->update([
        //     'latitude' => $req->latitude,
        //     'longitude' => $req->longitude,
        // ]);

        // $result = Driver::getDriver($req);

        // dd($result);

        // broadcast(new DriverLocationUpdated($driverLocation))->toOthers();

        // return $result;
    }

}
