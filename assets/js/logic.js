
// Map Logic
/* In this example we’ll use the mapbox/streets-v11 tiles from Mapbox’s Static Tiles API (in order to use tiles from Mapbox, you must also request an access token). Because this API returns 512x512 tiles by default (instead of 256x256), we will also have to explicitly specify this and offset our zoom by a value of -1.*/

//USGS API:
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
var geoJson;



/* ______*1. INSTANTIATE MAP *_________*_________*_________*_________*________*/
//var map = L.map('mapid').setView([51.505, -0.09], 13);
var map = L.map('mapid', {
  //center: [20, 0],
  center: [21.445594, -159.7501637],
  zoom: 2,
  worldCopyJump: true,
  //maxBounds: ([[70, - 7], [-30, -6.99999]])
});

//map.setView([biggestEarthquakeLat, biggestEarthquakeLon]);
//var map = L.map('mapid').setView([0.445594, 0.7501637], 5)

/* ______*2. ADD TILE LAYER  *_________*_________*_________*_________*________*/
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/satellite-streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  //accessToken: process.env.apiKey
  //accessToken: apiKey //'your.mapbox.access.token'
  accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'
}).addTo(map);

/* ______* FUNCTION: GET COLOR BREAKS _*_________*_________*_________*________*/
function getColor(d) {
  return d > 8.5 ? '#d73027' :
    d > 6.0 ? '#fc8d59' :
      d > 4.5 ? '#fee090' :
        d > 2.5 ? '#e0f3f8' :
          d > 1.0 ? '#91bfdb' :
            '#4575b4';
};
/* ______* GET DATA + ADD TO MAP ______*_________*_________*_________*________*/
////////////////////////////////////////////////////////////

d3.json(url).then(function (response) {
  var featureArray = response.features;
  let adjusted = [];
  let mag = [];

  featureArray.forEach((data) => {
    //console.log(data.geometry);
    if (data.geometry.coordinates[0] > 0) {
      var less = data.geometry.coordinates[0] - 360;
      //var coords = l.latLng(data.geometry[1], less)
      //console.log(data.geometry.coordinates[0]);
      return L.circleMarker({ lon: less, lat: data.geometry.coordinates[1] }, {
        radius: data.properties.mag * data.properties.mag / (0.5 + 0.4 * data.properties.mag),
        onEachFeature: rainbows,
        fillColor: getColor(parseFloat(data.properties.mag)),
        color: '#0185aa',
        weight: 0.6,
        opacity: 0.7,
        fillOpacity: 0.8
      }).addTo(map)
      /*.bindPopup("<ul><li>Magnitude: " +
        feature.properties.mag + "</li>" +
        "<li>Depth: " +
        feature.properties.mag + " " + feature.properties.magType + "</li>" +
        "<li>TsunamiPotential: " +
        feature.properties.tsunami + "</li>" +
        "</ul>");*/
    }
  });
  console.log(response);
  // set variables
  var geoJsonFeature = response;

  //read in geoJSON data to Leaflet
  L.geoJSON(geoJsonFeature, {
    style: function (feature) {
      return feature.properties && feature.properties.style;
    },
    onEachFeature: rainbows,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * feature.properties.mag / (0.5 + 0.4 * feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: getColor(feature.properties.mag),
        //radius: Math.pow(parseFloat(feature.properties.mag), 1.5),
        //fillColor: getColor(parseFloat(feature.properties.mag)),
        color: '#0185aa', //getColor(parseFloat(feature.properties.mag)),
        weight: 0.6,
        opacity: 0.7,
        fillOpacity: 0.8
      }).addTo(map).bindPopup("I am a circle.");;
    }

  });

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    //var limits = geojson.options.limits;
    var colors = ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'];
    var breaks = ['8.5+', '6.0', '4.5', '2.5', '1.0'];
    var colorLabels = [];
    var labels = [];
    div.innerHTML = "";
    //div.innerHTML = "<p>Magnitude</p>";
    breaks.forEach(function (limit, index) {
      colorLabels.push('<i style="background:' + colors[index] + ';"></i>' + ' ' + breaks[index]);
      labels.push(' ' + breaks[index] + ' ');
    });
    div.innerHTML += colorLabels.join("<br>");
    //div.innerHTML += "<br>"
    //div.innerHTML += labels.join("");
    return div;
  };
  //Adding legend to the map
  legend.addTo(map);
});
/*
legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;


/* ______*5. EVENT HANDLING  *_________*_________*_________*_________*________*/
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
};


// make it a popup:
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on('click', onMapClick);

function rainbows(feature, layer) {
  var popupContent = "<ul><li>Magnitude: " +
    feature.properties.mag + "</li>" +
    "<li>Depth: " +
    feature.properties.mag + " " + feature.properties.magType + "</li>" +
    "<li>TsunamiPotential: " +
    feature.properties.tsunami + "</li>" +
    "</ul>"
    ;

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties.popupContent;
  }

  layer.bindPopup(popupContent);
};