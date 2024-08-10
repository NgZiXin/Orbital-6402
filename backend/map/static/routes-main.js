// Global variables
const segmentsId = []; // Record all segments that have been added to map
const next = new Map(); // Store marker's next
const prev = new Map(); // Store marker's prev
const routeArr = []; // store added polyline
let prevMarker = undefined; // Previous point user has marked
let totalDistance = 0; // Track distance of route
let orderCount = 0; // Track order count

// Creating map overlays
const stravaSegments = L.layerGroup([]);
const route = L.layerGroup([]);
const final = L.layerGroup([]);

// Set map boundaries
const bounds = L.latLngBounds(
  L.latLng(1.144, 103.535),
  L.latLng(1.494, 104.502)
);

// Configure map
const mapOptions = {
  center: [1.2868108, 103.8545349],
  zoom: 17,
  layers: [ORIGINAL, route, stravaSegments],
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
};

const map = new L.map("map", mapOptions);

// Layers control
const baseMaps = {
  Original: ORIGINAL,
  Default: DEFAULT,
  Night: NIGHT,
  Grey: GREY,
  Street: STREET,
};
const overlayMaps = {
  "Strava Segments": stravaSegments,
  "Plotted Route": route,
};
const layerControl = L.control
  .layers(baseMaps, overlayMaps, { position: "topleft" })
  .addTo(map);

// Map control to display map info
L.Control.textbox = L.Control.extend({
  onAdd: function (map) {
    this._container = L.DomUtil.create("div");
    this._container.id = "info_text";
    this._container.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    this._container.style.padding = "10px";
    this._container.style.borderRadius = "5px";
    this.dist = totalDistance;
    this._updateContent();

    // Prevent event propagation
    L.DomEvent.disableClickPropagation(this._container);

    return this._container;
  },

  onRemove: function (map) {
    // Do nothing here
  },

  // Method to update the content
  updateContent: function (dist) {
    this.dist = dist; // Store the updated distance

    // Update the HTML content based on the updated distance
    this._updateContent();
  },

  // Internal method to update the HTML content
  _updateContent: function () {
    if (!this._container) return;

    this._container.innerHTML = `<div>${
      this.dist < 10000
        ? `<strong>Total Distance: ${this.dist.toFixed(0)} m</strong>`
        : `<strong>Total Distance: ${(this.dist / 1000).toFixed(2)} km</strong>`
    }</div>
    <br />
    <button id="generateRouteButton" style="background-color: green; color: white;">Generate Route</button>
    <button id="resetButton" style="background-color: red; color: white;">Reset</button>`;

    // Add event listener for the button
    const generatebutton = this._container.querySelector(
      "#generateRouteButton"
    );
    if (generatebutton) {
      generatebutton.addEventListener(
        "click",
        this._generateRouteClick.bind(this)
      );
    }
    // Add event listener for the "Reset" button
    const resetButton = this._container.querySelector("#resetButton");
    if (resetButton) {
      resetButton.addEventListener("click", function (e) {
        e.stopPropagation();

        // Add back all functionalities
        map.on("click", clickMap);
        map.on("zoomend", segmentQuery);
        map.on("dragend", segmentQuery);

        // Reset global variables
        segmentsId.length = 0;
        next.clear();
        prev.clear();
        routeArr.length = 0;
        prevMarker = undefined;
        totalDistance = 0;
        orderCount = 0;

        // Clear final route
        map.removeLayer(final);

        // Reset textbox
        textboxControl.updateContent(totalDistance);

        // Reset the overlays
        Object.values(overlayMaps).forEach((overlay) => {
          overlay.eachLayer((layer) => {
            overlay.removeLayer(layer);
          });
        });

        // Clear layerControl
        for (const [key, value] of Object.entries(overlayMaps)) {
          layerControl.removeLayer(value);
          map.removeLayer(value);
        }

        // Add back overlays to layerControl & map
        for (const [key, value] of Object.entries(overlayMaps)) {
          layerControl.addOverlay(value, key);
          value.addTo(map);
        }
      });
    }
  },

  // Finalise route button
  _generateRouteClick: function () {
    // Remove all of map functionalities
    map.off("click", clickMap);
    map.off("zoomend", segmentQuery);
    map.off("dragend", segmentQuery);

    // Clear layerControl
    for (const [key, value] of Object.entries(overlayMaps)) {
      layerControl.removeLayer(value);
      map.removeLayer(value);
    }

    // Compress all polyline in route overlay
    let coordinates = [];
    routeArr.sort((p1, p2) => p1.options.order - p2.options.order);
    routeArr.forEach((polyline) =>
      polyline.getLatLngs().forEach((latlng) => coordinates.push(latlng))
    );

    if (coordinates.length > 0) {
      const polyline = L.polyline(coordinates, { distanceMarkers: true });

      // Get Start & End Point
      const start = L.circleMarker(coordinates[0]);
      const end = L.circleMarker(coordinates[coordinates.length - 1]);

      // Set Styles
      polyline.setStyle(chosenRoute);
      start.setStyle(startingPoint);
      end.setStyle(endingPoint);

      // Add to Map
      final.eachLayer((layer) => final.removeLayer(layer)); // Clear layers in final
      final.addLayer(polyline);
      final.addLayer(start);
      final.addLayer(end);
      final.addTo(map);
    }
  },
});
L.control.textbox = function (opts) {
  return new L.Control.textbox(opts);
};
const textboxControl = L.control.textbox({ position: "topright" }).addTo(map);

// Marker functionality
map.on("click", clickMap);

// Zoom & Drag functionalities
map.on("zoomend", segmentQuery);
map.on("dragend", segmentQuery);

// Map on load
map.on("load", segmentQuery);
map.fire("load");

// Event functions
function clickMap(e) {
  // Open Pop-up
  L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `<div>
          <code>lat: ${e.latlng.lat.toFixed(5)}, lng: ${e.latlng.lng.toFixed(
        5
      )}</code>
          <br />
          <code>Add point as next waypoint?</code>
          <br />
          <button id="add-marker-button" data-lat='${e.latlng.lat}' data-lng='${
        e.latlng.lng
      }' style="margin-top: 5px;">Add</button>
        </div>`
    )
    .openOn(map);
}

// Event delegation for dynamically added buttons
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "add-marker-button") {
    const lat = parseFloat(e.target.dataset.lat);
    const lng = parseFloat(e.target.dataset.lng);
    addMarker(lat, lng);
    map.closePopup();
  }
});

function addMarker(lat, lng) {
  // Create Marker
  const marker = new L.circleMarker([lat, lng], { connectedLines: [] });

  // Route building logic
  if (prevMarker != undefined) {
    const fitStart = prev.size == 0;
    buildRoute(prevMarker, marker, fitStart, true, orderCount);
    orderCount += 1;
  }

  // Add "click" event to marker
  marker.on("click", (e) => clickWaypoint(e, marker));

  // Add marker to routes
  route.addLayer(marker);

  // Style marker
  marker.setStyle(selectPoint);

  // Update prevMarker
  prevMarker = marker;
}

function buildRoute(start, end, fitStart, fitEnd, order) {
  // Update hashMaps
  prev.set(end, start);
  next.set(start, end);

  // Query path geometry
  const startCoords = `${start.getLatLng().lat}%2C${start.getLatLng().lng}`;
  const endCoords = `${end.getLatLng().lat}%2C${end.getLatLng().lng}`;

  fetch(`${url}get_path?start=${startCoords}&end=${endCoords}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // TODO: Cannot find route
      }
      return response.json();
    })
    .then((data) => {
      // Coordinates
      const coordinates = L.Polyline.fromEncoded(
        data["route_geometry"]
      ).getLatLngs();

      // Fit points to path geometry
      if (fitStart) {
        start.setLatLng(coordinates[0]); // Change start coordinates to fit
      } else {
        coordinates.unshift(start.getLatLng()); // Edit path geometry to include start point
      }
      if (fitEnd) {
        end.setLatLng(coordinates[coordinates.length - 1]); // Change end coordinates to fit
      } else {
        coordinates.push(end.getLatLng()); // Edit path geometry to include end points
      }

      // Get polyline
      const polyline = L.polyline(coordinates, { order: order });

      // Add polyline to route
      route.addLayer(polyline);
      routeArr.push(polyline);

      // Style polyline
      polyline.setStyle(selectPolyline);

      // Associated markers with polyline
      start.options.connectedLines.push(polyline);
      end.options.connectedLines.push(polyline);

      // Update total distance
      totalDistance += polyline.getDistance();
      textboxControl.updateContent(totalDistance);
    });
}

function clickWaypoint(e, marker) {
  L.DomEvent.stopPropagation(e); // Stop event propagation

  // Open Pop-up
  const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `
      <div>
      <code>
        lat: ${parseFloat(marker.getLatLng().lat).toFixed(5)}, 
        lng: ${parseFloat(marker.getLatLng().lng).toFixed(5)}
      </code>
      <br />
      <code>Remove waypoint?</code>
      <br />
      <button id='marker-delete-button' style="margin-top: 5px">Remove</button>
    </div>`
    )
    .openOn(map);

  // Popup "delete" button
  // TODO: In future use event delegation
  // Currently use a temporary timeout solution (NOT RELIABLE)
  setTimeout(() => {
    document
      .getElementById("marker-delete-button")
      .addEventListener("click", () => {
        // Close Popup
        map.closePopup(popup);

        const prevWaypoint = prev.get(marker);
        const nextWaypoint = next.get(marker);

        // Join previous and next waypoints together
        if ((prevWaypoint != undefined) & (nextWaypoint != undefined)) {
          buildRoute(
            prevWaypoint,
            nextWaypoint,
            false,
            false,
            marker.options.connectedLines[0].options.order // Maintain order
          );
        }

        // Update hashMap
        if (prevWaypoint) {
          next.set(prevWaypoint, nextWaypoint);
        }
        if (nextWaypoint) {
          prev.set(nextWaypoint, prevWaypoint);
        }
        prev.delete(marker);
        next.delete(marker);

        // Update prevMarker
        if (prevMarker == marker) {
          prevMarker = prevWaypoint;
        }
        
        // Delete marker and polylines from map
        route.removeLayer(marker);
        marker.options.connectedLines.forEach((line) => {
          if (route.hasLayer(line)) {
            route.removeLayer(line);
            removeItemOnce(routeArr, line);
            totalDistance -= line.getDistance();
          }
        });
      });
  }, 100);
}

function segmentQuery(e) {
  // Obtain important data
  const bounds = map.getPixelBounds(map.getCenter(), e.target._zoom);
  const sw = map.unproject(bounds.getBottomLeft(), e.target._zoom);
  const ne = map.unproject(bounds.getTopRight(), e.target._zoom);
  const boundbox = [sw.lat, sw.lng, ne.lat, ne.lng];

  // Send Get Request to Strava
  fetch(
    `https://www.strava.com/api/v3/segments/explore?bounds=${boundbox}&activity_type=running`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stravaToken}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Deconstruct Request
      for (let i = 0; i < data["segments"].length; i++) {
        const dataObj = data["segments"][i];

        // Save items permanently and display on the map
        if (!segmentsId.includes(dataObj["id"])) {
          segmentsId.push(dataObj["id"]);

          // Get Polyline
          const coordinates = L.Polyline.fromEncoded(
            dataObj["points"]
          ).getLatLngs();
          const polyline = L.polyline(coordinates, { order: NaN });
          stravaSegments.addLayer(polyline);

          // Get Start & End Point
          const start = L.circleMarker(dataObj["start_latlng"], {
            connectedLines: [polyline],
          });
          const end = L.circleMarker(dataObj["end_latlng"], {
            connectedLines: [polyline],
          });
          stravaSegments.addLayer(start);

          // Set Styles
          polyline.setStyle(normalPolyline);
          start.setStyle(normalPoint);
          end.setStyle(normalPoint);

          // Add "click" event to polyline and start marker
          polyline.on("click", (e) =>
            clickSegment(e, start, end, polyline, dataObj["name"])
          );
          start.on("click", (e) =>
            clickSegment(e, start, end, polyline, dataObj["name"])
          );
        } else {
          // TODO
        }
      }
    });
}

function clickSegment(e, start, end, polyline, segmentName) {
  L.DomEvent.stopPropagation(e); // Stop event propagation

  // Change style
  polyline.setStyle(highlightPolyline);
  start.setStyle(highlightPoint);

  // Open Pop-up
  const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `<div>
        <p>Segment Name: ${segmentName}</p>
        <p>Distance: ${polyline.getDistance()} metres</p>
        <button id="polylineButton">Add</button>
      </div>`
    )
    .openOn(map);

  // Closing Pop-up
  popup.on("remove", () => {
    polyline.setStyle(normalPolyline);
    start.setStyle(normalPoint);
  });

  // Logic for adding of segments
  // TODO: In future use event delegation
  // Currently use a temporary timeout solution (NOT RELIABLE)
  setTimeout(() => {
    document
      .getElementById("polylineButton")
      .addEventListener("click", function () {
        // Close popup
        map.closePopup(popup);

        // Build route to start point
        if (prevMarker != undefined) {
          const fitStart = prev.size == 0;
          buildRoute(prevMarker, start, fitStart, false, orderCount);
          orderCount += 1;
        }

        // Update hashMap
        prev.set(end, start);
        next.set(start, end);

        // Update prevMarker
        prevMarker = end;

        // Edit polyline
        polyline.off("click");
        polyline.options.order = orderCount;
        orderCount += 1;

        // Layer management
        stravaSegments.removeLayer(start);
        stravaSegments.removeLayer(polyline);
        route.addLayer(start);
        route.addLayer(end);
        route.addLayer(polyline);

        // Add click event to markers
        start.on("click", (e) =>
          clickSegmentWaypoint(e, start, end, polyline, segmentName)
        );
        end.on("click", (e) =>
          clickSegmentWaypoint(e, start, end, polyline, segmentName)
        );

        // Style marker and polyline
        start.setStyle(selectSegmentPoint);
        end.setStyle(selectSegmentPoint);
        polyline.setStyle(selectPolyline);

        // Update totalDistance and routeArr
        routeArr.push(polyline);
        totalDistance += polyline.getDistance();
      });
  }, 100);
}

function clickSegmentWaypoint(e, start, end, polyline, segmentName) {
  L.DomEvent.stopPropagation(e); // Stop event propagation

  // Change style
  polyline.setStyle(highlightPolyline);
  start.setStyle(highlightPoint);
  end.setStyle(highlightPoint);

  // Open Pop-up
  const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `<div>
        <p>Segment Name: ${segmentName}</p>
        <p>Distance: ${polyline.getDistance()} metres</p>
        <code>Remove this segment?</code>
        <button id="removeButton">Remove</button>
      </div>`
    )
    .openOn(map);

  // Closing Pop-up
  popup.on("remove", () => {
    polyline.setStyle(selectPolyline);
    start.setStyle(selectSegmentPoint);
    end.setStyle(selectSegmentPoint);
  });

  // Logic for removing of segments
  // TODO: In future use event delegation
  // Currently use a temporary timeout solution (NOT RELIABLE)
  setTimeout(() => {
    document
      .getElementById("removeButton")
      .addEventListener("click", function () {
        // Close Popup
        map.closePopup(popup);

        const prevWaypoint = prev.get(start);
        const nextWaypoint = next.get(end);

        // Join previous and next waypoints together
        if ((prevWaypoint != undefined) & (nextWaypoint != undefined)) {
          buildRoute(
            prevWaypoint,
            nextWaypoint,
            false,
            false,
            start.options.connectedLines[0].options.order
          );
        }

        // Update hashMap
        if (prevWaypoint) {
          next.set(prevWaypoint, nextWaypoint);
        }
        if (nextWaypoint) {
          prev.set(nextWaypoint, prevWaypoint);
        }
        prev.delete(start);
        next.delete(start);
        prev.delete(end);
        next.delete(end);

        // Update prevMarker
        if (prevMarker == end) {
          prevMarker = prevWaypoint;
        }

        // Delete marker and polylines from map
        map.removeLayer(start);
        start.options.connectedLines.forEach((line) => {
          if (route.hasLayer(line)) {
            route.removeLayer(line);
            removeItemOnce(routeArr, line);
            totalDistance -= line.getDistance();
          }
        });
        map.removeLayer(end);
        end.options.connectedLines.forEach((line) => {
          if (route.hasLayer(line)) {
            route.removeLayer(line);
            removeItemOnce(routeArr, line);
            totalDistance -= line.getDistance();
          }
        });
      });
  }, 100);
}
