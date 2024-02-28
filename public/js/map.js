let map, markers = [];

/*
|--------------------------------------------------------------------------
| Initialize Map
|--------------------------------------------------------------------------
*/
function initMap() {

    // OpenStreet tile layer and its settings
    const OpenStreet    = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        noWrap: true
    });

    // GoogleStrees tile layer
    const GoogleStreets = L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains:["mt0", "mt1", "mt2", "mt3"]
    });

    // GoogleHybrid tile layer
    const GoogleHybrid  = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",{
        maxZoom: 20,
        subdomains:["mt0", "mt1", "mt2", "mt3"]
    });

    // GoogleSat tile layer
    const GoogleSat     = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains:["mt0", "mt1", "mt2", "mt3"]
    });

    // GoogleTerrain tile layer
    const GoogleTerrain = L.tileLayer("http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains:["mt0", "mt1", "mt2", "mt3"]
    });

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

    const Division = new gridDivLayer({
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

    const Canvas = new gridCanvasLayer({
        noWrap: true,
        bounds: [[-90, -180], [90, 180]]
    });

    // Custom Control
    let zoomDivRef;
    const ZoomView = L.Control.extend({
        onAdd: function(map) {

            var div = L.DomUtil.create("div", "leaflet-zoom-control leaflet-bar-part leaflet-bar");

            div.style.cssText = `padding: 3px 7px`;

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
    const gridsAsOverLay = { Division, Canvas };
    const baseMaps       = { GoogleStreets, GoogleHybrid, GoogleSat, GoogleTerrain, OpenStreet };
    const layers         = L.control.layers(baseMaps, gridsAsOverLay, { position: 'topleft' });

    // Scale control
    const scale          = L.control.scale();

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
    });

    // Leaflet map init
    map = L.map("map", {

        // Default Map
        layers: [GoogleStreets],

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

        if (event.layerType = 'polyline') {
            var coords = layer.getLatLngs();
            var length = 0;
            for (var i = 0; i < coords.length - 1; i++) {
                length += coords[i].distanceTo(coords[i + 1]);
            }
            console.log(length);
        }

        if (layer instanceof L.Marker) {
            layer.bindPopup(`Latitude: ${layer.getLatLng().lat}</br>Longitude: ${layer.getLatLng().lng}`).openPopup();
        }
    });

    // Map edit handler
    map.on("draw:edited", (event) => {

        let layers = event.layers;

        layers.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                layer.bindPopup(`Latitude: ${layer.getLatLng().lat}</br>Longitude: ${layer.getLatLng().lng}`).openPopup();
            }
        });
    });

    // Map zoom handler
    map.on("zoomend", () => {
        zoomDivRef.innerHTML = `Zoom: ${map.getZoom()}`;
    });

    // Map click handler
    // map.on("click", mapClicked);

    // Panel
    L.Control.Panel = L.Control.extend({
        onAdd: function(map) {

            var routing = L.DomUtil.create("div", "panel");

            routing.style.cssText = `
                background: #FFF;
                width: 70vh;
                height: 100vh;
                white-space: nowrap;
                padding: 5px;
                box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
                margin-top: -5px;
                margin-right: -5px;
            `;

            routing.innerHTML = `

                <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">

                    <!-- Title & Description -->
                    <div style="font-size: 20px;">Routing</div>
                    <div style="font-size: 12px; color: #C0C0C0;">
                        This is a sample of routing. Choose a location by placing the marker on the map.
                    </div>

                    <!-- Inputs -->
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; gap: 5px; justify-content: center; align-items: center;">
                            <div style="cursor: pointer;">
                                <svg width="25px" height="25px" viewBox="-3 0 24 24" id="meteor-icon-kit__solid-map-marker" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.7685 23.0866C9.7296 23.1333 9.6866 23.1763 9.6399 23.2152C9.2154 23.5686 8.5849 23.511 8.2315 23.0866C2.74384 16.4959 0 11.6798 0 8.63811C0 3.86741 4.2293 0 9 0C13.7707 0 18 3.86741 18 8.63811C18 11.6798 15.2562 16.4959 9.7685 23.0866zM9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.3431 6 6 7.34315 6 9C6 10.6569 7.3431 12 9 12z" fill="#758CA3"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="routing-locate-i"
                                style="width: 100%; border: 1px solid lightgray; padding: 7px; color: #1A73E8;"
                                disabled="disabled"
                                placeholder="Location Address Here">
                        </div>
                        <div style="display: flex; gap: 5px; justify-content: center; align-items: center;">
                            <div style="cursor: pointer;">
                                <svg width="25px" height="25px" viewBox="-3 0 24 24" id="meteor-icon-kit__solid-map-marker" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.7685 23.0866C9.7296 23.1333 9.6866 23.1763 9.6399 23.2152C9.2154 23.5686 8.5849 23.511 8.2315 23.0866C2.74384 16.4959 0 11.6798 0 8.63811C0 3.86741 4.2293 0 9 0C13.7707 0 18 3.86741 18 8.63811C18 11.6798 15.2562 16.4959 9.7685 23.0866zM9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.3431 6 6 7.34315 6 9C6 10.6569 7.3431 12 9 12z" fill="#758CA3"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="routing-locate-ii"
                                style="width: 100%; border: 1px solid lightgray; padding: 7px; color: #D56D00;"
                                disabled="disabled"
                                placeholder="Location Address Here">
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div style="display: flex;">
                        <div style="display: flex;">
                            <button
                                type="button"
                                id="mark-routing"
                                style="padding: 7px 15px; border-radius: 5px; background-color: #758CA3; color: white; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                                Locate
                            </button>
                        </div>

                        <div style="display: flex; margin-left: auto;">
                            <button
                                type="button"
                                id="generate-routing"
                                style="padding: 7px 15px; border-radius: 5px; background-color: #50C878; color: white; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                                Generate
                            </button>
                        </div>
                    </div>

                    <!-- Routing Result -->
                    <div id="routing-response" style="height: 100vh; overflow: auto; border: 1px solid lightgray; background-color: #FAFAFA; padding: 5px;"></div>
                </div>`;

            return routing;
        },
        onRemove: function(map) {

            // Nothing to do here
        }
    });

    L.control.panel = function(opts) {
        return new L.Control.Panel(opts);
    }

    L.control.panel({
        position: "topright"
    }).addTo(map);
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
    initMarkers(locate);
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

/*
|--------------------------------------------------------------------------
| Routing: Place Marker
|--------------------------------------------------------------------------
*/
var routingMarker   = [];

let routingLocateI  = $("#routing-locate-i");
let routingLocateII = $("#routing-locate-ii");
let routingResponse = $("#routing-response");

// Routing onclick map
function mapRoutingClicked($event) {

    if (routingMarker.length <= 1) {

        var locateRouting = [{
            "position": {
                "lat": $event.latlng.lat,
                "lng": $event.latlng.lng
            },
            "draggable": false
        }];

        routingMarker.push(locateRouting);

        if (routingMarker.length == 1) {
            routingLocateI.val(`${routingMarker[0][0].position.lat},${routingMarker[0][0].position.lng}`);
        }

        if (routingMarker.length == 2) {
            routingLocateII.val(`${routingMarker[1][0].position.lat},${routingMarker[1][0].position.lng}`);
        }

        // Place marker
        initMarkers(locateRouting);
    }
}

// Locate Routing Markers
function locateRoutingMarker(locate, sequence) {

    $(locate).on("click", function(e) {
        e.stopPropagation();
        map.on("click", mapRoutingClicked);
    });
}

// Locate Routing Generate
function generateRoutingMarker(generate) {

    $(generate).on("click", function(e) {
        e.stopPropagation();

        if (routingLocateI.val() && routingLocateII.val()) {

            routingLocateI.attr("style", "width: 100%; border: 1px solid lightgray; padding: 7px; color: #1A73E8;");
            routingLocateII.attr("style", "width: 100%; border: 1px solid lightgray; padding: 7px; color: #D56D00;");

            utilizeRouting(routingLocateI.val(), routingLocateII.val());

        } else {

            if (!routingLocateI.val()) {
                routingLocateI.attr("style", "width: 100%; border: 1px solid red; padding: 7px; color: #1A73E8;");

            } else {
                routingLocateI.attr("style", "width: 100%; border: 1px solid lightgray; padding: 7px; color: #1A73E8;");
            }

            if (!routingLocateII.val()) {
                routingLocateII.attr("style", "width: 100%; border: 1px solid red; padding: 7px; color: #D56D00;");

            } else {
                routingLocateII.attr("style", "width: 100%; border: 1px solid lightgray; padding: 7px; color: #D56D00;");
            }
        }
    })
}

// Routing functionality
function utilizeRouting(latlngStart, latlngEnd) {

    $.ajax({

        type: "GET",
        url: "api/geoapify",
        data: {
            waypoints: `${latlngStart}|${latlngEnd}`,
            mode: "drive"
        },
        dataType: "json",
        success: function (response) {

            if (response.status == 200) {

                // Invoke connect routes
                connectRouting(JSON.parse(response.result));

            } else {
                routingResponse.text("There was an error!");
            }
        }
    });
}

var coordinates  = []
var steps        = [];
var instructions = [];
var stepPoints   = [];

// Connect between routes
function connectRouting(data) {

    data.features[0].properties.legs.forEach((leg, legIndex) => {

        const legGeometry = data.features[0].geometry.coordinates[legIndex];

        leg.steps.forEach((step, index) => {
            if (step.instruction) {
                instructions.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": legGeometry[step.from_index]
                    },
                    properties: {
                        text: step.instruction.text
                    }
                });
            }

            if (index !== 0) {
                stepPoints.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": legGeometry[step.from_index]
                    },
                    properties: step
                })
            }

            if (step.from_index === step.to_index) {
                // destination point
                return;
            }

            const stepGeometry = legGeometry.slice(step.from_index, step.to_index + 1);
            steps.push({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": stepGeometry
                },
                properties: step
            });
        });
    });

    $.each(data.features[0].geometry.coordinates[0], (index, coordinate) => {
        coordinates.push([coordinate[1], coordinate[0]]);
    });

    if (coordinates.length > 0) {

        var polylineOptions = {
            color: "rgba(20, 137, 255, 0.7)",
            weight: 7,
            opacity: 0.7
        };

        var pathLine = new L.polyline(coordinates, polylineOptions).addTo(map);
        map.fitBounds(pathLine.getBounds());

        routingResponse.empty();

        // Show results in the textarea
        $.each(instructions, (index, route) => {
            routingResponse.append(`
                <div style="display: flex;">
                    <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 280.028 280.028" xml:space="preserve">
                        <g>
                            <path style="fill:#324D5B;" d="M131.263,131.263v140.014c0,4.839,3.912,8.751,8.751,8.751s8.751-3.912,8.751-8.751V131.263H131.263z"/>
                            <path style="fill:#E2574C;" d="M140.014,0c48.331,0,87.509,39.186,87.509,87.509s-39.178,87.517-87.509,87.517c-48.322,0.009-87.509-39.195-87.509-87.517S91.691,0,140.014,0z"/>
                            <path style="fill:#E87970;" d="M166.266,43.763c14.5,0,26.253,11.744,26.253,26.244S180.767,96.26,166.266,96.26c-14.491,0-26.253-11.752-26.253-26.253C140.014,55.515,151.775,43.763,166.266,43.763z"/>
                            <path style="fill:#CB4E44;" d="M148.765,166.284c-48.313,0-87.509-39.204-87.509-87.526c0-21.938,8.13-41.934,21.466-57.292C64.24,37.524,52.505,61.125,52.505,87.509c0,48.322,39.186,87.517,87.509,87.517c26.393,0,49.994-11.744,66.043-30.217C190.699,158.163,170.703,166.284,148.765,166.284z"/>
                        </g>
                    </svg>
                    <span style="flex-basis: auto; margin-left: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #758CA3; margin-left: 5px;">
                        ${route.properties.text}
                    </span>
                </div>
            `);
        });
    }
}

// Invoke Routing function
locateRoutingMarker("#mark-routing");
generateRoutingMarker("#generate-routing");