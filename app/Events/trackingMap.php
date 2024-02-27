<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
// app/Events/LocationUpdated.php

// class LocationUpdated implements ShouldBroadcast
// {
//     public $latitude;
//     public $longitude;

//     public function __construct($latitude, $longitude)
//     {
//         $this->latitude = $latitude;
//         $this->longitude = $longitude;
//     }

//     public function broadcastOn()
//     {
//         return new PrivateChannel('location-channel');
//     }
// }


class trackingMap
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
