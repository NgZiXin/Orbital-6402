// Icon
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Creating map overlays
const parks = L.layerGroup([]);
const gyms = L.layerGroup([]);

// Configure map
const mapOptions = {
  center: [initial_lat, initial_lng],
  zoom: 13,
  layers: [ORIGINAL, parks, gyms],
};

const map = new L.map("map", mapOptions);

// Layers control
const baseMaps = {
  Original: ORIGINAL,
  Default: DEFAULT,
  Night: NIGHT,
  Grey: GREY,
};

const overlayMaps = {};
if (type == "gym") {
  overlayMaps["Gyms"] = gyms;
}
if (type == "park") {
  overlayMaps["Parks"] = parks;
}
const layerControl = L.control
  .layers(baseMaps, overlayMaps, { position: "topleft" })
  .addTo(map);

const search = () => {
  if (type == "gym" || type == "park") {
    let query;
    let icon;
    if (type == "gym") {
      query = `${url}find_gyms/?lat=${initial_lat}&lon=${initial_lng}&radius=${radius}`;
      icon = redIcon
    } else {
      query = `${url}find_parks/?lat=${initial_lat}&lon=${initial_lng}&radius=${radius}`;
      icon = greenIcon
    }

    console.log(query)
    fetch(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((item) => {

          const marker = L.marker([item.latitude, item.longitude], {icon});
          const popup = L.popup().setContent(
            `<code>Name: ${item.name}</code><br /><code>Distance: ${parseFloat(
              item.distance
            ).toFixed(2)} km</code>`
          );
          marker.bindPopup(popup);

          if (type == "gym") {
            gyms.addLayer(marker); // Add marker to gyms layer
            // marker.setStyle({
            //   color: "red",
            // });
          } else {
            parks.addLayer(marker); // Add marker to parks layer
            // marker.setStyle({
            //   color: "green",
            // });
          }
        });

        // Add position marker
        const marker = L.marker([initial_lat, initial_lng]);
        // marker.setStyle({
        //   color: "blue",
        // });
        const popup = L.popup().setContent("Your Location");
        marker.bindPopup(popup);
        map.addLayer(marker); // Add marker to map
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
};

// Fire event
map.on("load", search);
map.fire("load");
