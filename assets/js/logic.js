
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
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: apiKey //'your.mapbox.access.token'
}).addTo(map);

/* ______* GET DATA + ADD TO MAP ______*_________*_________*_________*________*/
////////////////////////////////////////////////////////////

d3.json(url).then(function (response) {
  var featureArray = response.features;
  let adjusted = [];
  let mag = [];

  featureArray.forEach((data) => {
    console.log(data.geometry);
    if (data.geometry.coordinates[0] > 0) {
      var less = data.geometry.coordinates[0] - 360;
      //var coords = l.latLng(data.geometry[1], less)
      console.log(data.geometry.coordinates[0]);
      return L.circleMarker({ lon: less, lat: data.geometry.coordinates[1] }, {
        radius: data.properties.mag,
        fillColor: "blue",
        color: "#aaeeaa",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
      }).addTo(map);
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
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag,
        fillColor: "blue",
        color: "#aaeeaa",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
      }).addTo(map).bindPopup("I am a circle.");;
    }

  });
});


//d3.json(url).then(function (response) {

//});

// var offsetLng = function (data) {
//   var featuresSub = geoJsonFeature.features;
//   //console.log(features);
//   featuresSub.forEach(function (data) {
//     let minus = data;
//     let plus = data;
//     var lesser = minus.geometry.coordinates[1] - 360;
//     var plusser = plus.geometry.coordinates[1] + 360;
//     //console.log(minus.features.geometry.coordinates[1] - 360);
//     minus.geometry.coordinates[1] = lesser;
//     plus.geometry.coordinates[1] = plusser;
//     minusGeoJ.features.push(minus);
//     plusGeoJ.features.push(plus);
//   });
//   //feature.properties.style
//   console.log(plusGeoJ);

//var dataCopy = 
/*L.geoJSON(plusGeoJ, {
  style: function (feature) {
    return feature.properties && feature.properties.style;
  },
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: feature.properties.mag,
      fillColor: "red",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    }).addTo(map);
  }
 
});*/



/*
@25.2555512,161.7579865,3z
bbox: left, bottom, top, right
bbox: 0, -90, 90, 0
 
bbox: Array(6)
0: -179.988
1: -65.3522
2: -3.5099999904633 --min depth
3: 179.9678
4: 78.3794
5: 627.79 -- max depth
 
bbox: [0, -90, , 0.0001, 90, ,]
 
L.latLngBounds(<LatLng[]> latlngs)
 
var corner1 = L.latLng(40.712, -74.227),
corner2 = L.latLng(40.774, -74.125),
bounds = L.latLngBounds(corner1, corner2);
 
data.bbox[0] = 0
data.bbox[1] = -90
data.bbox[3] = 0.0001
data.bbox[4] = 90
 
map.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
]);
*/

/*
{
    type: "FeatureCollection",
    metadata: {
      generated: Long Integer,    url: String,
      title: String,              api: String,
      count: Integer,             status: Integer
    },
    bbox: [
      minimum longitude,          minimum latitude,
      minimum depth,              maximum longitude,
      maximum latitude,           maximum depth
    ],
    features: [
      {
        type: "Feature",
        properties: {
          mag: Decimal,          place: String,
          time: Long Integer,    updated: Long Integer,
          tz: Integer,            url: String,
          detail: String,         felt:Integer,
          cdi: Decimal,          mmi: Decimal,
          alert: String,        status: String,
          tsunami: Integer,     sig:Integer,
          net: String,          code: String,
          ids: String,          sources: String,
          types: String,        nst: Integer,
          dmin: Decimal,        rms: Decimal,
          gap: Decimal,         magType: String,
          type: String
        },
        geometry: {
          type: "Point",
          coordinates: [longitude,  latitude,  depth ]
        },
        id: String
      },
      …
    ]
  }
  */

//var myLayer = L.geoJSON().addTo(map);
//onEachFeature Function


/*
    var changeData = {"properties": {"mag": [data.}
      "geometry": {
        "type": "Point", "coordinates": [data.geometry.coordinates[0], data.geometry.coordinates[1] - 360, data.geometry.coordinates[2]]
      }
    "geometry"
      "coordinates"[,,]
      "type": "Point"
    "properties": "mag"
 
 
    var plus = { "type": "Feature", "properties": "geometry": { type: "Point", coordinates: Array(3)
  }, "id"};
mysetofthings.push(plus);
 
mygreatarray = [{ "type": "Feature", "properties": "geometry": { type: "Point", coordinates: Array(3) }, "id"};}{ "type": "Feature", "properties": "geometry": { type: "Point", coordinates: Array(3) }, "id"};}]
 
mygreatarray.forEach(
  geoJsonFeature.feature.concat(mygreatarray)
        });
//if (data.geometry.coordinates[1] > 0) {
latlngPlus.push([data.geometry.coordinates[0], data.geometry.coordinates[1] - 360]) //, data.geometry.coordinates[2]])
latlngMinus.push([data.geometry.coordinates[0], data.geometry.coordinates[1] + 360]) //, data.geometry.coordinates[2]])
  });
console.log(latlngPlus);
*/

// geoJson = L.choropleth(data, {
//   // Define what  property in the features to use
//   valueProperty: "MHI2016",
//   // Set color scale
//   scale: ["#ffffb2", "#b10026"],
//   // Number of breaks in step range
//   steps: 10,
//   // q for quartile, e for equidistant, k for k-means
//   mode: "q",
//   style: {
//     // Border color
//     color: "#fff",
//     weight: 1,
//     fillOpacity: 0.8
//   },
//   // Binding a pop-up to each layer
//   onEachFeature: function (feature, layer) {
//     layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//       "$" + feature.properties.MHI2016);
//   }
// }).addTo(myMap);

// // Set up the legend
// var legend = L.control({ position: "bottomright" });
// legend.onAdd = function () {
//   var div = L.DomUtil.create("div", "info legend");
//   var limits = geojson.options.limits;
//   var colors = geojson.options.colors;
//   var labels = [];
//   // Add min & max
//   var legendInfo = "<h1>Median Income</h1>" +
//     "<div class=\"labels\">" +
//     "<div class=\"min\">" + limits[0] + "</div>" +
//     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";
//   div.innerHTML = legendInfo;
//   limits.forEach(function (limit, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   });
//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
//};
// Adding legend to the map
//legend.addTo(myMap);
//});


/* ______*3. ADD MARKERS/ETC *_________*_________*_________*_________*________*/
/*
var marker = L.marker([20.5, -200.09]).addTo(map);

var circle = L.circle([20.508, -220.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 1000
}).addTo(map);

var polygon = L.polygon([
  [20.509, -159.08],
  [20.503, -159.06],
  [20.51, -159.047]
]).addTo(map);
*/

/* ______*4. ADD POPUPS TEXT *_________*_________*_________*_________*________*/
//.openPopup(); //openPopup only works for markers! //it overrides your map geo defaults
//circle.bindPopup("I am a circle.");
//polygon.bindPopup("I am a polygon.");

// Can add a popup as a layer:
//var popup = L.popup()
//  .setLatLng([20, -159.09])
//  .setContent("I am a standalone popup.")
//.openOn(map); // openOn > "addTo" because it closes previously open popup

/* ______*5. EVENT HANDLING  *_________*_________*_________*_________*________*/
//function onMapClick(e) {
//  alert("You clicked the map at " + e.latlng);
//}

//map.on('click', onMapClick);

//Improve previous code to make it a popup instead of an alert:
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

//map.on('click', onMapClick);
function onEachFeature(feature, layer) {
  var popupContent = "<p>I started out as a GeoJSON " +
    feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties.popupContent;
  }

  layer.bindPopup(popupContent);
};

/*
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(map);
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
*/

/*myLayer.addData(geojsonFeature);
var data = L.geoJSON(data, {
  geometry: function (feature) {
    console.log({ feature });
  },
  style: function (feature) {
    console.log(feature.properties.coordinates);
    return { color: feature.properties.color };
  },
  filter: function (geoJsonFeature) {
    return true;
  }
}).bindPopup(function (layer) {
  return layer.feature.properties.description;
}).addTo(map);
});*
L.geoJSON(someGeojsonFeature, {
pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
}
}).addTo(map);*/


//L.circleMarker


//d3.text("/path/to/file.txt").then(function(text) {
//console.log(text); // Hello, world!
//});
//});


//function onMapZoom(e) {
  //var zoomLevel = map.getZoom();
  //.setRadius(zoomLevel);
//};

//map.on('zoomend', onMapZoom);


/*
	var map = L.map('map').setView([39.74739, -105], 13);

	var baseballIcon = L.icon({
		iconUrl: 'baseball-marker.png',
		iconSize: [32, 37],
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]
	});

	function onEachFeature(feature, layer) {
		var popupContent = "<p>I started out as a GeoJSON " +
				feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

	L.geoJSON([bicycleRental, campus], {

		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
	}).addTo(map);

	L.geoJSON(freeBus, {

		filter: function (feature, layer) {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
			}
			return false;
		},

		onEachFeature: onEachFeature
	}).addTo(map);

	var coorsLayer = L.geoJSON(coorsField, {

		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: baseballIcon});
		},

		onEachFeature: onEachFeature
	}).addTo(map);
*/