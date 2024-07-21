
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
let depths = [90,70,50,30,10,-10]
let colors = ["red","orangered", "orange", "yellow", "greenyellow", "lightgreen"]


// Function to Create and populate individual markers
function createMarkers(response){

  // assign geojson response to variable
  let earthquakes = response.features
 
  // intialize marker array
  let quakeMarkers = []

  // loop will determine location, size and color of markers 
  for (let index = 0; index < earthquakes.length; index++) {
    // pull individual earthquake and assign to variable
    let quake = earthquakes[index];

    // grab depth of quake
    let depth = (quake.geometry.coordinates[2]);

    //intialize colorValue
    let colorValue = "";

    // if statement bins depth into 6 categories and assigns color 
    if (depth >=depths[0]){
      // depth greater than or equal to 90 -> color red
      colorValue = colors[0]
    } else if (depth >=depths[1]) {
       // depth greater than or equal to 70 -> color orangered
      colorValue = colors[1]
    } else if (depth >=depths[2]) {
       // depth greater than or equal to 50 -> color orange
      colorValue = colors[2]
    } else if (depth >=depths[3]) {
       // depth greater than or equal to 30 -> color yellow
      colorValue = colors[3]
    } else if (depth >=depths[4]) {
       // depth greater than or equal to 10 -> color greenyellow
      colorValue = colors[4]
    } else {
       // depth is less than 10 -> color lightgreen
      colorValue = colors[5]
    }

    // Create the markers and assign the calculated properties
    let quakeMarker = L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],
      {
        color:"darkgreen", 
        fillColor:  colorValue,
        radius: (earthquakes[index].properties.mag)*5,   
        weight: .5,
        fillOpacity:.85
      })
      .bindPopup(
        "<h3>" + quake.properties.title + "<h3><h3>Magnitude: " + quake.properties.mag  + "</h3>"+ "<h3><h3>Depth: " + depth  + " kms</h3>"
    );
    
    //adds marker to array holding all markers
    quakeMarkers.push(quakeMarker);
  }
  
  // creates map overlay that display markers
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

  // Create an overlayMaps object to hold the earthquake marker layer.
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

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [-10,10,30,50,70,90];
    let colors = ["lightgreen", "greenyellow", "yellow" , "orange","orangered","red"];
    let labels = [];

    // Create Legend
    let legendInfo = 

      div.innerHTML += "<h4>Depth</h4>";

      colors.forEach(function(limit, index) {
        labels.push("<i style=\"background: " + colors[index] + "\">&nbsp&nbsp&nbsp&nbsp" )
                
        labels.push("</i>" + "<span>  "+ limits[index]);
        
        if (limits[index+1]==undefined) {labels.push("+")}
        else {labels.push("–" + limits[index+1] + "</span><br>")}
      });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;
  };


  // Adding the legend to the map
  legend.addTo(myMap);

};

d3.json(url).then(createMarkers);