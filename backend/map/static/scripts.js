// Creating map options
var mapOptions = {
  center: [1.3331189, 103.8145682],
  zoom: 13,
};

// Creating a map object
var map = new L.map("map", mapOptions);

// Creating a Layer object
var layer = new L.TileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
);

// Add marker functionality
map.on("click", function (e) {
  console.log(e.latlng.lat);
  new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
});

// Zoom functionalities
map.on("zoomstart", function (e) {
  // Do Nothing
});
map.on("zoomend", function (e) {
  const bounds = map.getPixelBounds(e.target._lastCenter, e.target._zoom);
  const sw = map.unproject(bounds.getBottomLeft(), e.target._zoom);
  const ne = map.unproject(bounds.getTopRight(), e.target._zoom);
  const boundbox = [sw.lat, sw.lng, ne.lat, ne.lng];
  console.log(boundbox);
  // Obtain Strava Token ID from user (Hardcode for now)

  const token = "5057b151b572c907544d73b85ac4d25ec661d982"; // Temp

  let segments = [];

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
      console.log(data);
      for (let i = 0; i < data["segments"].length; i++) {
        console.log(data["segments"][i]);
        const coordinates = L.Polyline.fromEncoded(
          data["segments"][i]["points"]
        ).getLatLngs();
        const polyline = L.polyline(coordinates, {
          color: "red",
          weight: 5,
          opacity: 0.5,
          // dashArray: "20,15",
          // lineJoin: "round",
        }).addTo(map);
      }
    });

  // Make map overlay clickable

  //
});

// Adding layer to the map
map.addLayer(layer);
