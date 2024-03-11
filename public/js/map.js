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

                        <div style="display: flex; gap: 5px; margin-left: auto;">
                            <button
                                type="button"
                                id="generate-routing"
                                style="padding: 7px 15px; border-radius: 5px; background-color: #50C878; color: white; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                                Generate
                            </button>

                            <button
                                type="button"
                                id="start-routing"
                                style="padding: 7px 15px; border-radius: 5px; background-color: #EDC42E; color: white; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px; display: none;">
                                Start
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

            if (response.status == 200 && JSON.parse(response.result).features) {

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

        // Invoke start
        startRouting("#start-routing", coordinates);

        var polylineOptions = {
            color: "rgba(66, 133, 244, 0.7)",
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

// Start Routing
function startRouting(start, coordinates) {

    $(start).fadeIn();

    let isMoving    = false;
    const MOVE_TIME = 1000;

    var vehicleSVG = {
        _truck: `<svg width="50px" height="50px" id=Capa_1 version=1.1 viewBox="0 0 512 512" xml:space=preserve xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><g><g><rect height=176 style=fill:#5c546a width=40 x=336 y=200 /></g><g><path d=M480,392H32c-8.837,0-16-7.163-16-16v-16h480v16C496,384.837,488.837,392,480,392z style=fill:#5c546a /></g><g><path d="M492.031,247.459l-77.883-108.58C412.625,137.055,410.375,136,408,136h-32c-4.422,0-8,3.582-8,8v216c0,4.418,3.578,8,8,8h112c13.234,0,24-10.766,24-24v-72.881C512,259.256,503.352,249.377,492.031,247.459z" style=fill:#ff4f19 /></g><g><path d="M446.702,144c10.33,0,19.502,6.61,22.768,16.411l22.561,87.048c0,0-57.544-11.693-74.491-16.34C407.143,228.269,400,218.78,400,208v-64H446.702z" style=fill:#5c546a /></g><g><g><path d="M400,152c-4.422,0-8-3.582-8-8v-38.059c0-4.27-1.664-8.289-4.688-11.316l-8.969-8.969c-3.125-3.125-3.125-8.188,0-11.313s8.188-3.125,11.313,0l8.969,8.969c6.047,6.051,9.375,14.086,9.375,22.629V144C408,148.418,404.422,152,400,152z" style=fill:#8a8895 /></g></g><g><path d="M328,104H24c-13.234,0-24,10.766-24,24v216c0,13.234,10.766,24,24,24c0,0,315.578,0,320,0s8-3.582,8-8V128C352,114.766,341.234,104,328,104z" style=fill:#527991 /></g><g><path d=M0,344c0,13.234,10.766,24,24,24h320c4.422,0,8-3.582,8-8v-56H0V344z style=fill:#5d647f /></g><g><path d="M248,408h-64c-8.837,0-16-7.163-16-16v-16c0-8.837,7.163-16,16-16h64c8.837,0,16,7.163,16,16v16C264,400.837,256.837,408,248,408z" style=fill:#8a8895 /></g><g><g><path d="M192,392c-2.078,0-4.164-0.883-5.68-2.32c-1.445-1.52-2.32-3.602-2.32-5.68c0-2.082,0.875-4.16,2.32-5.68c3.039-2.961,8.398-2.961,11.359,0c1.438,1.52,2.32,3.598,2.32,5.68c0,2.078-0.883,4.16-2.398,5.68C196.156,391.117,194.078,392,192,392z" style=fill:#5c546a /></g></g><g><path d=M484,304c-6.627,0-12,5.373-12,12s5.373,12,12,12h12v-24H484z style=fill:#ffd100 /></g><g><g><circle cx=96 cy=384 r=56 style=fill:#5c546a /></g><g><circle cx=96 cy=384 r=32 style=fill:#8a8895 /></g></g><g><g><circle cx=416 cy=384 r=56 style=fill:#5c546a /></g><g><circle cx=416 cy=384 r=32 style=fill:#8a8895 /></g></g><g><rect height=24 style=fill:#fff width=16 x=496 y=304 /></g><g><path d=M472,136h-96c-4.418,0-8,3.582-8,8v8h104c4.422,0,8-3.582,8-8S476.422,136,472,136z style=fill:#e7001e /></g></g></svg>`,
        _car: `<svg width="50px" height="50px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M766.976 508.736c80.576 0 152.448 32.128 199.232 82.176" fill="#AEBCC3" /><path d="M64.704 684.992c10.816 19.2 32.064 32.192 56.576 32.192h784.64c35.84 0 64.832-27.648 64.832-61.76v-17.408h-36.608a15.744 15.744 0 0 1-16.064-15.296V550.912a277.568 277.568 0 0 0-150.144-44.16h1.6l-55.04-0.256c-53.632-115.2-157.504-210.752-294.208-210.752-136.512 0-251.008 89.728-282.176 210.688h-16.832c-35.456 0-56.128 27.392-56.128 61.184" fill="#E8447A" /><path d="M64.704 654.464h13.76a39.168 39.168 0 0 0 40.064-38.272v-17.6c0-21.12-17.92-38.208-40.064-38.208h-13.376" fill="#F5BB1D" /><path d="M160 684.992a101.632 96.832 0 1 0 203.264 0 101.632 96.832 0 1 0-203.264 0Z" fill="#455963" /><path d="M218.88 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3" /><path d="M652.032 684.992a101.568 96.832 0 1 0 203.136 0 101.568 96.832 0 1 0-203.136 0Z" fill="#455963" /><path d="M710.912 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3" /><path d="M966.272 591.104v-0.192a257.92 257.92 0 0 0-48.192-40V622.72c0 8.448 7.232 15.296 16.064 15.296h36.608v-42.304l-4.48-4.608z" fill="#F5BB1D" /><path d="M405.568 335.616c-104.896 6.336-191.296 76.8-216.64 170.816h216.64V335.616zM445.696 506.432h216.64c-41.216-86.848-117.12-159.616-216.64-170.048v170.048z" fill="#631536" /></svg>`,
        _scooter: `<svg width="50px" height="50px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 504 504" xml:space="preserve"><g><g><polygon style="fill:#E7001E;" points="200,265.833 224.702,141.26 264,209.833 260.552,225.833 255.793,249.833 "/></g><g><path style="fill:#8A8895;" d="M408,249.833c-13.683,0-24.691,11.45-23.966,25.291c0.68,12.978,12.328,22.709,25.324,22.709H416c4.418,0,8-3.582,8-8v-32c0-4.418-3.582-8-8-8H408z"/></g><g><path style="fill:#5C546A;" d="M448,353.833c-30.928,0-56,25.072-56,56c0,30.928,25.072,56,56,56s56-25.072,56-56C504,378.905,478.928,353.833,448,353.833z M448,441.833c-17.673,0-32-14.327-32-32c0-17.673,14.327-32,32-32s32,14.327,32,32C480,427.506,465.673,441.833,448,441.833z"/></g><g><g><path style="fill:#8A8895;" d="M448,417.833c-2.047,0-4.094-0.781-5.656-2.344l-72-72c-3.125-3.125-3.125-8.188,0-11.313s8.188-3.125,11.313,0l72,72c3.125,3.125,3.125,8.188,0,11.313C452.094,417.052,450.047,417.833,448,417.833z"/></g></g><g><path style="fill:#E7001E;" d="M296,409.833L296,409.833c-26.51,0-48-21.49-48-48v-48H144v96h128L296,409.833z"/></g><g><g><path style="fill:#E7001E;" d="M307.422,417.833H184c-4.422,0-8-3.578-8-8s3.578-8,8-8h123.422c5.25,0,10.164-2.578,13.156-6.891l52.609-75.992c6.125-8.852,7.398-20.102,3.398-30.102l-19.992-49.992c-1.219-3.047-4.141-5.023-7.43-5.023H328c-4.422,0-8-3.578-8-8s3.578-8,8-8h21.164c9.875,0,18.617,5.922,22.289,15.078l19.992,50c5.992,14.992,4.086,31.867-5.102,45.148l-52.609,75.992C327.75,412.685,317.914,417.833,307.422,417.833z"/></g></g><g><path style="fill:#7E5C62;" d="M256,313.833H104c-8.837,0-16-7.163-16-16l0,0c0-8.837,7.163-16,16-16h152c8.837,0,16,7.163,16,16v0C272,306.67,264.837,313.833,256,313.833z"/></g><g><path style="fill:#FFE0B1;" d="M152,281.833H16c-8.837,0-16-7.163-16-16v-80c0-8.837,7.163-16,16-16h136c8.837,0,16,7.163,16,16v80C168,274.669,160.837,281.833,152,281.833z"/></g><g><g><rect y="201.833" style="fill:#F7AA6B;" width="168" height="16"/></g></g><g><g><path style="fill:#FF4F19;" d="M368,417.833c-4.422,0-8-3.578-8-8c0-48.523,39.477-88,88-88c15.461,0,30.672,4.07,43.977,11.758c3.828,2.211,5.141,7.109,2.93,10.93c-2.219,3.828-7.125,5.133-10.93,2.93c-10.883-6.289-23.32-9.617-35.977-9.617c-39.703,0-72,32.297-72,72C376,414.255,372.422,417.833,368,417.833z"/></g></g><g><g><path style="fill:#FF4F19;" d="M328,225.833h-56c-6.059,0-11.602-3.422-14.313-8.844l-32-64c-3.949-7.906-0.746-17.516,7.156-21.469c7.898-3.953,17.508-0.758,21.469,7.156l27.574,55.156H328c8.836,0,16,7.164,16,16S336.836,225.833,328,225.833z"/></g></g><g><g><path style="fill:#5C546A;" d="M203.173,249.833h110.124c10.391,0,20.172,5.07,26.156,13.57c5.988,8.492,7.473,19.406,3.977,29.195l-38.527,99.396c-2.473,6.313-8.512,10.172-14.902,10.172c-1.941,0-3.914-0.359-5.832-1.109c-8.227-3.227-12.285-12.508-9.063-20.734l38.359-98.943L216,281.833c-8.836,0-16-7.164-16-16"/></g></g><g><path style="fill:#FFE0B1;" d="M295.299,74.143c-1.492-2.594-4.117-4.125-7.336-3.984c-59.297,3.078-59.297,7.195-59.297,14.672c0,4.172,2.367,29.117,2.844,34.078c0.188,2.016,1.141,3.883,2.664,5.227c7.32,6.469,16.727,10.031,26.492,10.031c22.055,0,40-17.945,40-40C300.667,87.135,298.815,80.206,295.299,74.143z"/></g><g><g><path style="fill:#7E5C62;" d="M24,233.833L24,233.833c-4.418,0-8-3.582-8-8v-24h16v24C32,230.251,28.418,233.833,24,233.833z"/></g></g><g><g><path style="fill:#7E5C62;" d="M136,233.833L136,233.833c-4.418,0-8-3.582-8-8v-24h16v24C144,230.251,140.418,233.833,136,233.833z"/></g></g><g><path style="fill:#5C546A;" d="M160,409.833c0,17.673-14.327,32-32,32s-32-14.326-32-32H72c0,30.928,25.072,56,56,56s56-25.071,56-56H160z"/></g><g><path style="fill:#FF4F19;" d="M129.472,314.507c-45.692,5.925-82.676,39.423-93.868,83.254c-2.566,10.049,5.226,19.812,15.597,19.812h157.226c5.809-11.671,8.644-25.084,7.201-39.318C211.401,336.556,171.036,309.118,129.472,314.507z"/></g><g><path style="fill:#E7001E;" d="M310.198,68.136c-12.288-23.369-39.148-35.318-65.691-27.66c-18.92,5.459-33.78,21.237-38.281,40.407c-3.404,14.494-1.233,28.991,6.165,41.581c1.383,2.354,4.023,3.703,6.753,3.703l23.547,0c4.04,0,7.785-2.12,9.863-5.585l18.31-30.527c1.447-2.412,4.053-3.888,6.866-3.888h21.547c4.352,0,8.297-2.234,10.555-5.969C312.073,76.479,312.214,71.972,310.198,68.136z"/></g></g></svg>`
    }

    const svgIcon = L.divIcon({
        html: vehicleSVG._scooter,
        className: "",
        iconSize: [24, 40],
        iconAnchor: [12, 40],
    });

    const routingMarker = L.Marker.movingMarker(coordinates, 30000, {
        autostart: false,
        icon: svgIcon
    }).addTo(map).on("end", () => {
        isMoving = false;
    });

    $(start).on("click", function(e) {
        e.preventDefault();

        routingMarker.start();
        isMoving = true;

        let getVehicleLatlng = setInterval(() => {

            storeMovingMarker(routingMarker.getLatLng().lat, routingMarker.getLatLng().lng);

            if (isMoving == false) {
                clearInterval(getVehicleLatlng);
            }

        }, 1000);
    });
}

// Moving marker
function storeMovingMarker(lat, lon) {

    var http   = new XMLHttpRequest();
    var url    = 'api/update-driver-location';
    var params = `latitude=${lat}&longitude=${lon}`;

    http.open('POST', url, true);

    // Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {

            // Do something here...
        }
    }
    http.send(params);
}

// Real time
function echoSocket() {

    window.onload = function() {

        Echo.channel('channel-name').listen('DriverLocationUpdated', (e) => {
            console.log(e);
        });
    };
}

// Invoke Routing function
locateRoutingMarker("#mark-routing");
generateRoutingMarker("#generate-routing");
echoSocket();