document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([0, 0], 2); // Set the initial map view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Add an OpenStreetMap tile layer

    const apiKey = 'c52e09b0f9d7449c8265cb341a1c3b89'; // Replace with your Geoapify API key

    // Coordinates of point A and B
    const pointA = { lat: 37.7749, lon: -122.4194 }; // Example: San Francisco, CA
    const pointB = { lat: 34.0522, lon: -118.2437 }; // Example: Los Angeles, CA

    // Request directions from Geoapify Directions API
    fetch(`https://api.geoapify.com/v1/routing?waypoints=${pointA.lon},${pointA.lat}|${pointB.lon},${pointB.lat}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const route = data.features[0].geometry.coordinates;

            // Draw the route on the map using Leaflet Polyline
            const polyline = L.polyline(route.map(coord => [coord[1], coord[0]]), { color: 'blue' }).addTo(map);

            // Fit the map to the bounds of the route
            map.fitBounds(polyline.getBounds());
        })
        .catch(error => console.error('Error fetching directions:', error));
});
