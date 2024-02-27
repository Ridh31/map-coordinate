<?php

namespace App\Listeners;

use App\Events\trackingMap;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class location
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\trackingMap  $event
     * @return void
     */
    public function handle(trackingMap $event)
    {
        //
    }
}
