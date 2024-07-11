
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

function createMarkers(response){
    

    let earthquakes = response.features
    console.log(earthquakes);
    let quakeMarkers = []

    for (let index = 0; index < earthquakes.length; index++) {
        let quake = earthquakes[index];
    
        // For each station, create a marker, and bind a popup with the station's name.
        let quakeMarker = L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
          .bindPopup("<h3>" + quake.properties.title + "<h3><h3>Alert: " + quake.properties.alert  + "</h3>");
    
        // Add the marker to the bikeMarkers array.
        quakeMarkers.push(quakeMarker);
    }
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    
    createMap(L.layerGroup(quakeMarkers));
};

function createMap(quakeMarkers) {
  // Create the tile layer that will be the background of our map.
  let streetMap= L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

      // Create a baseMaps object to hold the lightmap layer.
  let baseMaps = {
    "Street Map": streetMap
  }  

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = {
    "Earthquakes": quakeMarkers
  };

  let myMap = L.map("map", {
    center: [39.50, -98.35],
    zoom: 5,
    layers: [
      streetMap, quakeMarkers]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};



d3.json(url).then(createMarkers);