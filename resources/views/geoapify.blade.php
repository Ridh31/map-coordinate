  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leaflet Map Example</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
          #map {
              height: 400px;
          }
      </style>
  </head>
  <body>
  <script> src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"</script>
    <script> 
        var map = L.map("map").setView([28.2521, 83.9774], 12);
    var mapboxTile = L.tileLayer(
      "https://api.tiles.mapbox.com/styles/v1/{username}/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        username: "iamtekson",
        id: "cjwhym7s70tae1co8zf17a3r5",
        accessToken:
          "pk.eyJ1IjoiaWFtdGVrc29uIiwiYSI6ImNqdjV4YzI4YjB0aXk0ZHBtNnVnNWxlM20ifQ.FjQJyCTodXASYtOK8IrLQA",
      }
    ).addTo(map);
      if(!navigator.geolocation) 
      {
        console.log("Your brower don't support geolocation!");
      }
      else
      {
        navigator.geolocation.getCurrentPosition(position) 
      }

      function getCurrentPosition(position)
      {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var accuracy = position.coords.accuracy;
        var marker = L.marker([lat, long]).addTo(map);
        var circle = L.circle([lat, long],{radius:accuracy}).addTo(map);
        var featureGroup = L.featureGroup([marker,circle]).addTo(map);

        map.fitBound(featureGroup.getBounds());
        console.log(`Latitude: ${lat} Longitude: ${long} Accuracy: ${accuracy}`);
      }
    </script>
  <body>
</html>
    


