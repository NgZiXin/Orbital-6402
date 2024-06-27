import { ORIGINAL, DEFAULT, NIGHT, GREY } from "./basemaps.js";
import {
  normalPoint,
  normalPolyline,
  highlightPoint,
  highlightPolyline,
  selectSegmentPoint,
  selectPoint,
  selectPolyline,
} from "./styles.js";

// Global variables
const token = "a9026ea1829ce3f7edaab9c99936febcbba0f02d"; // Temp
const segmentsId = []; // Record all segments that have been added to map
const next = new Map(); // Store marker's next
const prev = new Map(); // Store marker's prev
let prevMarker = undefined; // Previous point user has marked
let totalDistance = 0; // Track distance of route

// Creating map overlays
const stravaSegments = L.layerGroup([]);
const route = L.layerGroup([]);

// Configure map
const mapOptions = {
  center: [1.28416,103.8533816],
  zoom: 17,
  layers: [ORIGINAL, route, stravaSegments],
};

const map = new L.map("map", mapOptions);

// Layers control
const baseMaps = {
  Original: ORIGINAL,
  Default: DEFAULT,
  Night: NIGHT,
  Grey: GREY,
};
const overlayMaps = {
  "Strava Segments": stravaSegments,
  "Plotted Route": route,
};
const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Marker functionality
map.on("click", clickMap);

// Zoom & Drag functionalities
map.on("zoomend", segmentQuery);
map.on("dragend", segmentQuery); // TODO Drag distance by too short dont call

// Map on load
map.on("load", segmentQuery);
map.fire("load")

// Event functions

function clickMap(e) {
  // Open Pop-up
  const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `<div>
        <code>lat: ${e.latlng.lat.toFixed(5)}, lng: ${e.latlng.lng.toFixed(
        5
      )}</code>
        <br />
        <code>Add point as next waypoint?</code>
        <br />
        <button id="add-marker-button" style="margin-top: 5px;">Add</button>
      </div>`
    )
    .openOn(map);

  // Logic for button
  document.getElementById("add-marker-button").addEventListener("click", () => {
    addMarker(e.latlng.lat, e.latlng.lng);
    map.closePopup(popup);
  });
}

function addMarker(lat, lng) {
  // Create Marker
  const marker = new L.circleMarker([lat, lng], { connectedLines: [] });

  // Route building logic
  if (prevMarker != undefined) {
    const fitStart = prev.size == 0;
    buildRoute(prevMarker, marker, fitStart, true);
  }

  // Add "click" event to marker
  marker.on("click", (e) => clickWaypoint(e, marker));

  // Add marker to routes
  route.addLayer(marker);

  // Style marker
  marker.setStyle(selectPoint);

  // Update prevMarker
  prevMarker = marker;

  console.log(prev);
}

function buildRoute(start, end, fitStart, fitEnd) {
  // Update hashMaps
  prev.set(end, start);
  next.set(start, end);

  // Query path geometry & distance
  const startCoords = `${start.getLatLng().lat}%2C${start.getLatLng().lng}`;
  const endCoords = `${end.getLatLng().lat}%2C${end.getLatLng().lng}`;

  fetch(
    `http://192.168.50.37:8000/map/get_path?start=${startCoords}&end=${endCoords}`,
    {
      method: "GET",
    }
  )
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
      const polyline = L.polyline(coordinates, {
        distance: data["total_distance"],
      });
      route.addLayer(polyline);

      // Style polyline
      polyline.setStyle(selectPolyline);

      // Associated markers with polyline
      start.options.connectedLines.push(polyline);
      end.options.connectedLines.push(polyline);
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
  document
    .getElementById("marker-delete-button")
    .addEventListener("click", () => {
      // Close Popup
      map.closePopup(popup);

      const prevWaypoint = prev.get(marker);
      const nextWaypoint = next.get(marker);

      console.log(prevWaypoint);
      console.log(nextWaypoint);
      // Join previous and next waypoints together
      if ((prevWaypoint != undefined) & (nextWaypoint != undefined)) {
        buildRoute(prevWaypoint, nextWaypoint, false, false);
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
      map.removeLayer(marker);
      marker.options.connectedLines.forEach((line) => {
        line.remove();
      });
    });
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
        Authorization: `Bearer ${token}`,
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
          const polyline = L.polyline(coordinates, {
            distance: dataObj["distance"],
          });
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
        <p>Distance: ${polyline.options.distance} metres</p>
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
  document
    .getElementById("polylineButton")
    .addEventListener("click", function () {
      // Close popup
      map.closePopup(popup);

      // Build route to start point
      if (prevMarker != undefined) {
        const fitStart = prev.size == 0;
        buildRoute(prevMarker, start, fitStart, false);
      }

      // Update hashMap
      prev.set(end, start);
      next.set(start, end);

      // Update prevMarker
      prevMarker = end;

      // Off polygon "click" event
      polyline.off("click");

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
    });
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
        <p>Distance: ${polyline.options.distance} metres</p>
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
  document
    .getElementById("removeButton")
    .addEventListener("click", function () {
      // Close Popup
      map.closePopup(popup);

      const prevWaypoint = prev.get(start);
      const nextWaypoint = next.get(end);

      // Join previous and next waypoints together
      if ((prevWaypoint != undefined) & (nextWaypoint != undefined)) {
        buildRoute(prevWaypoint, nextWaypoint, false, false);
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
        line.remove();
      });
      map.removeLayer(end);
      end.options.connectedLines.forEach((line) => {
        line.remove();
      });
    });
}
