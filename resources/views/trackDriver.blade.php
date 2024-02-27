{{-- <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Tracking</title>
    <style>
        #map {
            height: 500px;
        }
    </style>
</head>
<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script>
    var map = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function updateDriverLocation() {
        // Make an HTTP request to get the latest driver coordinates
        fetch('/track-driver')
            .then(response => response.json())
            .then(data => {
                // Update the marker position on the map
                if (marker) {
                    marker.setLatLng([data.lat, data.lon]);
                } else {
                    marker = L.marker([data.lat, data.lon]).addTo(map);
                }

                // Schedule the next update after a delay (adjust as needed)
                setTimeout(updateDriverLocation, 5000); // Update every 5 seconds
            })
            .catch(error => console.error('Error:', error));
    }

    var marker;
    updateDriverLocation(); // Start the tracking
</script>

</body>
</html> --}}

