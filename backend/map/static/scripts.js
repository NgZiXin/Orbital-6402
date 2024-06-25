// Global variables
const token = "96bdd905f77363bd5906fea379f13aa7c622b23a"; // Temp
segmentsId = []; // Record all segments that have been added to map
route = []; // Contains markers of waypoints & segment's start and end
next = new Map(); // Store marker's next
prev = new Map(); // Store marker's prev
totalDistance = 0; // Track distance of route

// Event functions

function clickMap(e) {
  // Open Pop-up
  const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `<div>
        <code>lat: ${e.latlng.lat.toFixed(2)}, lng: ${e.latlng.lng.toFixed(
        2
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
  // Add marker to map
  const marker = new L.circleMarker([lat, lng], {connectedLines: []});
  marker.bindPopup(`
    <div>
      <code>
        lat: ${lat.toFixed(2)}, 
        lng: ${lng.toFixed(2)}
      </code>
      <br />
      <code>Add point as next waypoint?</code>
      <br />
      <button id='marker-delete-button' style="margin-top: 5px";>Remove</button>
    </div>`);
  marker.on("popupopen", onMarkerPopupOpen);
  marker.addTo(map);

  // Style marker
  marker.setStyle(selectPoint);

  // Route building logic
  if (route.length > 0) {
    prevMarker = route[route.length - 1];
    prev.set(marker, prevMarker);
    next.set(prevMarker, marker);
    console.log(prevMarker);

    // Query path geometry & distance
    startCoords = `${prevMarker.getLatLng().lat}%2C${
      prevMarker.getLatLng().lng
    }`;
    endCoords = `${lat}%2C${lng}`;
    fetch(
      `http://127.0.0.1:8000/map/get_path?start=${startCoords}&end=${endCoords}`,
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
        // Get Polyline
        const coordinates = L.Polyline.fromEncoded(data["route_geometry"]).getLatLngs();;
        const polyline = L.polyline(coordinates).addTo(map);

        // Style polyline
        polyline.setStyle(selectPolyline);

        // Associated markers with polyline
        prevMarker.options.connectedLines.push(polyline);
        marker.options.connectedLines.push(polyline);
      });
  }

  // Add to route
  route.push(marker);
  console.log(route);
}

function onMarkerPopupOpen() {
  const tempMarker = this;

  document
    .getElementById("marker-delete-button")
    .addEventListener("click", () => {
      map.removeLayer(tempMarker);
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
        console.log(data["segments"][i]);
        const dataObj = data["segments"][i];

        // Save items permanently and display on the map
        if (!segmentsId.includes(dataObj["id"])) {
          segmentsId.push(dataObj["id"]);

          // Get Start & End Point
          const start = L.circleMarker(dataObj["start_latlng"], {
            connectedLines: [],
          }).addTo(map);
          const end = L.circleMarker(dataObj["end_latlng"], {
            connectedLines: [],
          }); //.addTo(map); // Don't add to Map

          // Get Polyline
          const coordinates = L.Polyline.fromEncoded(
            dataObj["points"]
          ).getLatLngs();
          const polyline = L.polyline(coordinates).addTo(map);

          // Associate line and point
          start.options.connectedLines.push(polyline);
          end.options.connectedLines.push(polyline);

          // Set Styles
          polyline.setStyle(normalPolyline);
          start.setStyle(normalPoint);
          end.setStyle(normalPoint);

          // Add interactive layer event to polyline
          polyline.on("click", (e) =>
            clickPolyline(
              e,
              polyline,
              start,
              end,
              dataObj["name"],
              dataObj["distance"]
            )
          );
          start.on("click", (e) =>
            clickPolyline(
              e,
              polyline,
              start,
              end,
              dataObj["name"],
              dataObj["distance"]
            )
          );

          // Add Mouseover event to highlight route
          polyline.on("mouseover", (e) =>
            mouseoverPolyline(e, polyline, start)
          );
          start.on("mouseover", (e) => mouseoverPolyline(e, polyline, start));

          // Add Mouseout event to reset route style
          polyline.on("mouseout", (e) => mouseoutPolyline(e, polyline, start));
          start.on("mouseout", (e) => mouseoutPolyline(e, polyline, start));
        } else {
          console.log("test");
        }
      }
    });
}

function clickPolyline(e, polyline, start, end, name, distance) {
  L.DomEvent.stopPropagation(e); // Stop event propagation

  // Disable mouseover and mouseout events and change style
  polyline.off("mouseover");
  polyline.off("mouseout");
  start.off("mouseover");
  start.off("mouseout");
  polyline.setStyle(highlightPolyline);
  start.setStyle(highlightPoint);

  // Open Pop-up
  const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(
      `<div>
        <p>${name}</p>
        <p>${distance}</p>
        <button id="polylineButton">Add</button>
      </div>`
    )
    .openOn(map);

  // Closing Pop-up
  popup.on("remove", () => {
    console.log("Popup closed");
    polyline.on("mouseover", (e) => mouseoverPolyline(e, polyline, start));
    polyline.on("mouseout", (e) => mouseoutPolyline(e, polyline, start));
    start.on("mouseover", (e) => mouseoverPolyline(e, polyline, start));
    start.on("mouseout", (e) => mouseoutPolyline(e, polyline, start));
    polyline.setStyle(normalPolyline);
    start.setStyle(normalPoint);
  });

  // Logic for adding of segments
  document
    .getElementById("polylineButton")
    .addEventListener("click", function () {
      console.log("hello");
    });
}

function mouseoverPolyline(e, polyline, start) {
  polyline.setStyle(highlightPolyline);
  start.setStyle(highlightPoint);
}

function mouseoutPolyline(e, polyline, start) {
  polyline.setStyle(normalPolyline);
  start.setStyle(normalPoint);
}

// Creating Map overlay
var mapOptions = {
  center: [1.3331189, 103.8145682],
  zoom: 17,
};
var map = new L.map("map", mapOptions);
var basemap = L.tileLayer(
  "https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png",
  {
    detectRetina: true,
    maxZoom: 19,
    minZoom: 11,
    /** DO NOT REMOVE the OneMap attribution below **/
    attribution:
      '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>',
  }
);
map.addLayer(basemap);

// Add map functionalities
// Marker functionality
map.on("click", clickMap);

// Zoom & Drag functionalities
map.on("zoomend", segmentQuery);
map.on("dragend", segmentQuery); // TODO Drag distance by too short dont call

// Styles
var normalPolyline = {
  color: "rgb(252, 76, 2)",
  weight: 4,
  opacity: 0.5,
};

var normalPoint = {
  color: "rgb(252, 76, 2)",
  radius: 6,
  fill: true,
  fillOpacity: 1,
  opacity: 0.5,
};

var highlightPolyline = {
  color: "red",
  weight: 4,
  opacity: 1,
};

var highlightPoint = {
  color: "red",
  radius: 6,
  fill: true,
  fillOpacity: 1,
  opacity: 1,
};

var selectPolyline = {
  color: "blue",
  weight: 4,
  opacity: 1,
};

var selectPoint = {
  color: "blue",
  radius: 6,
  fill: true,
  fillOpacity: 1,
  opacity: 1,
};
