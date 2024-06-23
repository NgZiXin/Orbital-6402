// Get Token
const token = "151940c27ad1c90a5e5855cba547fa1bdeadd3c8"; // Temp

// Define segmentQuery Function
segmentsId = [];

// Create list to display content
const dataList = document.getElementById("data-list");

function segmentQuery(e) {
  // Clear any existing content in List
  dataList.innerHTML = "";

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

        // Display items in a list
        const card = document.createElement("div");
        card.className = "card";

        const infoDiv = document.createElement("div");
        infoDiv.className = "info";
        card.appendChild(infoDiv);

        const leftCol = document.createElement("div");
        leftCol.className = "left-col";
        infoDiv.appendChild(leftCol)

        const rightCol = document.createElement("div");
        leftCol.className = "right-col";
        infoDiv.appendChild(rightCol)

        const name = document.createElement("h5");
        name.textContent = dataObj["name"];
        leftCol.appendChild(name);

        const distance = document.createElement("p");
        distance.textContent = dataObj["distance"];
        rightCol.appendChild(distance);

        const image = document.createElement("img");
        image.src = dataObj["elevation_profile"];
        rightCol.appendChild(image);
        
        dataList.appendChild(card);

        // Save items permanently and display on the map
        if (!segmentsId.includes(dataObj["id"])) {
          segmentsId.push(dataObj["id"]);
          // Get Start & End Point
          const start = L.circleMarker(dataObj["start_latlng"], {
            connectedLines: [],
            color: "red",
            radius: 5,
            fill: true,
            fillOpacity: 0.7,
            opacity: 0.5,
          }).addTo(map);
          const end = L.circleMarker(dataObj["end_latlng"], {
            connectedLines: [],
            color: "red",
            radius: 5,
            fill: true,
            fillOpacity: 0.7,
            opacity: 0.5,
          }).addTo(map);

          // Get Polyline
          const coordinates = L.Polyline.fromEncoded(
            dataObj["points"]
          ).getLatLngs();
          const polyline = L.polyline(coordinates, {
            color: "red",
            weight: 5,
            opacity: 0.5,
          }).addTo(map);

          // Associate line and point
          start.options.connectedLines.push(polyline);
          end.options.connectedLines.push(polyline);
        } else {
          console.log("test");
        }
      }
    });
}

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

// Zoom & Drag functionalities
map.on("zoomend", segmentQuery);
map.on("dragend", segmentQuery);

// Adding layer to the map
map.addLayer(layer);
