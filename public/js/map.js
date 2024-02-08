let map, markers = [];

/*
|--------------------------------------------------------------------------
| Initialize Map
|--------------------------------------------------------------------------
*/
function initMap() {

    // Mapbox tile layer and its settings
    const mapBoxToken = "pk.eyJ1IjoidHVtZXJvcmt1biIsImEiOiJjampudWt3OGwwOHg3M3BudWd6YTh6aWs2In0.B0Jq-sVRnIqwVkLQ3C5dyg";
    const MapBox      = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
        maxZoom: 20,
        id: "mapbox.streets",
        accessToken: mapBoxToken,
        noWrap: true
    });

    // OpenStreet tile layer and its settings
    const OpenStreet  = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        noWrap: true
    });

    // Google
    const Google      = L.tileLayer("http://www.google.cn/maps/vt?lyrs=s@189&gl=tr&x={x}&y={y}&z={z}", {
        attribution: "google",
        noWrap: true
    })

    // Grid tile with div
    const gridDivLayer = L.GridLayer.extend({

        createTile: function (coords) {

            const tile = document.createElement("div");

            tile.style.outline  = "1px dashed green";
            tile.style.fontSize = "10px";
            tile.innerHTML      = `
                <p class="gridTileCoordinates">
                    (x: ${coords.x}, y: ${coords.y})
                </p>
                <div class="gridTileZoom">
                    zoom: ${coords.z}
                </div>
            `;

            return tile;
        }
    });

    const gridDiv = new gridDivLayer({
        noWrap: true,
        bounds: [[-90, -180], [90, 180]]
    });

    // Grid tile with canvas
    const gridCanvasLayer = L.GridLayer.extend({

        createTile: function(coords) {

            // Create a <canvas> element for drawing
            var tile    = L.DomUtil.create("canvas", "leaflet-tile");

            // Setup tile width and height according to the options
            var size    = this.getTileSize();
            tile.width  = size.x;
            tile.height = size.y;

            // Get a canvas context and draw something on it using coords.x, coords.y and coords.z
            var ctx     = tile.getContext('2d');

            ctx.lineWidth   = 0.5;
            ctx.strokeStyle = "black";
            ctx.rect(0, 0, tile.width, tile.height);
            ctx.stroke();
            ctx.fillText(`( x: ${coords.x}, y: ${coords.y} )`, 5, 20);
            ctx.textAlign="center";
            ctx.fillText(`zoom: ${coords.z}`,size.x/2,size.y/2)

            // Return the tile so it can be rendered on screen
            return tile;
        }
    });

    const gridCanvas = new gridCanvasLayer({
        noWrap: true,
        bounds: [[-90, -180], [90, 180]]
    });

    // Custom Control
    let zoomDivRef;
    const ZoomView = L.Control.extend({
        onAdd: function(map) {

            var div       = L.DomUtil.create("div", "leaflet-zoom-control leaflet-bar-part leaflet-bar");

            div.innerHTML = "Zoom: " + map.getZoom();
            zoomDivRef    = div;
            return div;
        },
        onRemove: function(map) {

            // Nothing to do here
        }
    });

    L.control.zoomview   = (opts) => new ZoomView(opts);

    const zoom           = L.control.zoomview({ position: 'topleft' });

    // Layers control
    const gridsAsOverLay = { gridDiv, gridCanvas };
    const baseMaps       = { MapBox, Google, OpenStreet };
    const layers         = L.control.layers(baseMaps, gridsAsOverLay, { position: 'topleft' });

    // Scale control
    const scale          = L.control.scale()

    // Draw settings
    let drawnItems = new L.featureGroup();
    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            }
        }
    })

    // Leaflet map init
    map = L.map("map", {

        layers: [OpenStreet],

    }).setView([11.562108, 104.888535], 13); // lat, lng, zoom

    // add to map zoom control
    zoom.addTo(map);

    // Edit controls for drawings
    map.addControl(drawControl);

    // Add to map layers control
    layers.addTo(map);

    // Add to map scale control
    scale.addTo(map);

    // Layer for drawings
    map.addLayer(drawnItems);

    // Events
    map.on("draw:created", (event) => {

        let layer = event.layer;
        drawnItems.addLayer(layer);

        if (layer instanceof L.Marker) {
            layer.bindPopup(`Latitude: ${layer.getLatLng().lat}</br>Longitude: ${layer.getLatLng().lng}`).openPopup();
        }
    });

    map.on("draw:edited", (event) => {

        let layers = event.layers;

        layers.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                layer.bindPopup(`Latitude: ${layer.getLatLng().lat}</br>Longitude: ${layer.getLatLng().lng}`).openPopup();
            }
        });
    });

    // map zoom handler
    map.on("zoomend", () => {
        zoomDivRef.innerHTML = `Zoom: ${map.getZoom()}`;
    });

    // map click handler
    map.on("click", mapClicked);
}

initMap();

/*
|--------------------------------------------------------------------------
| Initialize Markers
|--------------------------------------------------------------------------
*/
function initMarkers(data) {

    $.each(data, (index, locate) => {

        const marker = generateMarker(locate, index);

        marker.addTo(map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
        map.panTo(locate.position);
        markers.push(marker);
    });
}

/*
|--------------------------------------------------------------------------
| Generate Marker
|--------------------------------------------------------------------------
*/
function generateMarker(data, index) {

    return L.marker(data.position, { draggable: data.draggable })
            .on("click", (event) => markerClicked(event, index))
            .on("dragend", (event) => markerDragEnd(event, index));
}

/*
|--------------------------------------------------------------------------
| Handle Map Click Event
|--------------------------------------------------------------------------
*/
function mapClicked($event) {

    var locate = [{
        "position": {
            "lat": $event.latlng.lat,
            "lng": $event.latlng.lng
        },
        "draggable": true
    }];

    // Place marker
    // initMarkers(locate);
}

/*
|--------------------------------------------------------------------------
| Handle Marker Click Event
|--------------------------------------------------------------------------
*/
function markerClicked($event, index) {
    console.log(map);
    console.log($event.latlng.lat, $event.latlng.lng);
}

/*
|--------------------------------------------------------------------------
| Handle Marker DragEnd Event
|--------------------------------------------------------------------------
*/
function markerDragEnd($event, index) {
    console.log(map);
    console.log($event.target.getLatLng());
}