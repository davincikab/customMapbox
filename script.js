////////////////////// MAP CONFIGURATION //////////////////////

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGYxMyIsImEiOiJjazR6dTM5cWkwZHU1M3JtNTVidzl3a2FlIn0.7Q4-VQ--zVEiXYJvPNK_9g";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/df13/ck1rlsmwq02zq1cnqquawed30",
  center: [150.180318, -34.605543],
  zoom: 0.2,
  minZoom: 1
});

// Render map copies
// map.setRenderWorldCopies(status === "false");

// Markers Array
var continentsMarkers = [];
var citiesmarkers = [];
var zoneContinents = [];
var countriesMarkers = [];
var zoneCountry = [];
var regionMarkers = [];
var zoneRegion = [];
var placesMarkers = [];

var drawContinent = [];

/////////////////////// FUNCTIONS ////////////////////////////////

// FUNCTION TO ADD THE MARKERS TO MAP

function AddToMap(sentarray) {
  for (i = 0; i < sentarray.length; i++) {
    sentarray[i].addTo(map);
  }
}

// FUNCTION TO REMOVE THE MARKERS TO MAP

function RemoveFromMap(sentarray) {
  console.log(sentarray[0]);
  //sentarray[0].remove();
  //console.log("Remove From Map()"+sentarray.length);
  for (i = 0; i < sentarray.length; i++) {
    sentarray[i].remove();
  }
}

////////////////////// MARKERS //////////////////////////////////

// CONTINENTS

map.on("load", function() {
  $.getJSON("data/continents.json", function(data) {
    data.features.forEach(function(feature) {
      var el = document.createElement("div");
      el.className = "marker marker-continent";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "50px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "50px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      continentsMarkers.push(mymarker);
    });
  });

  $.getJSON("data/zone_continents.json", function(data) {
    data.features.forEach(function(feature) {
      console.log(feature);
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "45px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "45px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      zoneContinents.push(mymarker);
      //citiesmarkers[0].addTo(map);
    });
    AddToMap(continentsMarkers);
  });

  $.getJSON("data/countries.json", function(data) {
    data.features.forEach(function(feature) {
      console.log(feature);
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "35px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "35px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      countriesMarkers.push(mymarker);
      //citiesmarkers[0].addTo(map);
    });
  });

  $.getJSON("data/zone_country.json", function(data) {
    data.features.forEach(function(feature) {
      console.log(feature);
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "40px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "40px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      zoneCountry.push(mymarker);
      //citiesmarkers[0].addTo(map);
    });
  });

  $.getJSON("data/region_country.json", function(data) {
    data.features.forEach(function(feature) {
      console.log(feature);
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "40px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "40px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      regionMarkers.push(mymarker);
      //citiesmarkers[0].addTo(map);
    });
  });

  $.getJSON("data/zone_region.json", function(data) {
    data.features.forEach(function(feature) {
      console.log(feature);
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "40px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "40px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      zoneRegion.push(mymarker);
      //citiesmarkers[0].addTo(map);
    });
  });

  // CITIES

  $.getJSON("data/cities.json", function(data) {
    data.features.forEach(function(feature) {
      console.log(feature);
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "40px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "40px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      citiesmarkers.push(mymarker);
      //citiesmarkers[0].addTo(map);
    });
  });

  $.getJSON("data/places.json", function(data) {
    data.features.forEach(function(feature) {
      console.log(feature);
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + feature.properties.icon + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "30px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "30px"; //marker.properties.iconSize[1] + 'px';

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
      placesMarkers.push(mymarker);
      //citiesmarkers[0].addTo(map);
    });
  });

  // click event on the icon

  ////////////////////////

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "continents", function() {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "continents", function() {
    map.getCanvas().style.cursor = "";
  });

  map.on("click", function(e) {
    if (e.defaultPrevented === false) {
      $("#sidebar").removeClass("visible");
      $("#map").removeClass("shorten");
    }
  });
  //////////////////////////////////////////////////////////

  AddToMap(continentsMarkers);

  // ZOOM
  map.on("zoom", function() {
    switch (true) {
      // CONTINENTS
      case map.getZoom() <= 2.1:
        // remove previous layer and source
        if (zoneContinents !== null) {
          RemoveFromMap(zoneContinents);
        }

        if (countriesMarkers !== null) {
          RemoveFromMap(countriesMarkers);
        }

        if (zoneCountry !== null) {
          RemoveFromMap(zoneCountry);
        }

        if (regionMarkers !== null) {
          RemoveFromMap(regionMarkers);
        }

        if (zoneRegion !== null) {
          RemoveFromMap(zoneRegion);
        }

        // add current source and layer
        AddToMap(continentsMarkers);

        // click event on the icon

        // end click event on the icon
        break;

      //

      // ZONE CONTINENTS
      case map.getZoom() > 2.1 && map.getZoom() <= 4.5:
        console.log(map.getZoom());
        //console.log(continentsMarkers);

        if (continentsMarkers !== null) {
          RemoveFromMap(continentsMarkers);
        }
        console.log("zone_continents");

        // remove previous layer and source

        AddToMap(zoneContinents);

        // remove next layer and source
        if (countriesMarkers !== null) {
          RemoveFromMap(countriesMarkers);
        }

        // add current source and layer

        // end click event on the icon

        // Change the cursor to a pointer when the mouse is over the places layer.

        ////////////////////////////////

        break;
      // COUNTRIES

      case map.getZoom() > 4.5 && map.getZoom() <= 5.7:
        // remove previous layer and source
        if (zoneContinents !== null) {
          RemoveFromMap(zoneContinents);
        }

        if (zoneCountry !== null) {
          RemoveFromMap(zoneCountry);
        }

        // remove next layer and source
        AddToMap(countriesMarkers);

        // add current source and layer

        // click event on the icon

        // end click event on the icon

        // Change the cursor to a pointer when the mouse is over the places layer.

        ////////////////////////////////

        break;

      // ZONE COUNTRY

      case map.getZoom() > 5.7 && map.getZoom() <= 7:
        // remove previous layer and source
        if (countriesMarkers !== null) {
          RemoveFromMap(countriesMarkers);
        }

        if (regionMarkers !== null) {
          RemoveFromMap(regionMarkers);
        }

        // remove next layer and source

        // add current source and layer
        AddToMap(zoneCountry);

        // click event on the icon

        // end click event on the icon

        // Change the cursor to a pointer when the mouse is over the places layer.

        ////////////////////////////////

        break;

      //  REGION
      case map.getZoom() > 7 && map.getZoom() <= 8:
        if (citiesmarkers !== null) {
          RemoveFromMap(citiesmarkers);
        }
        // remove previous layer and source
        if (zoneCountry !== null) {
          RemoveFromMap(zoneCountry);
        }

        if (zoneRegion !== null) {
          RemoveFromMap(zoneRegion);
        }

        // remove next layer and source

        // add current source and layer
        AddToMap(regionMarkers);

        // click event on the icon
        map.on("click", "region_country", function(e) {
          if (e.features[0].properties.title) {
            console.log(e.features[0].properties.title);
            var title = e.features[0].properties.title;

            e.preventDefault();
            $("#sidebar").addClass("visible");
            $("#map").addClass("shorten");

            $(".visible").empty();
            $("<h1>" + title + "</h1>").appendTo(".visible");
          }
        });
        // end click event on the icon

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on("mouseenter", "region_country", function() {
          map.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        map.on("mouseleave", "region_country", function() {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", function(e) {
          if (e.defaultPrevented === false) {
            $("#sidebar").removeClass("visible");
            $("#map").removeClass("shorten");
          }
        });
        ////////////////////////////////

        break;

      // ZONE REGION
      case map.getZoom() > 8 && map.getZoom() <= 9.1:
        if (citiesmarkers !== null) {
          RemoveFromMap(citiesmarkers);
        }

        if (regionMarkers !== null) {
          RemoveFromMap(regionMarkers);
        }

        if (placesMarkers !== null) {
          RemoveFromMap(placesMarkers);
        }

        // remove previous layer and source

        AddToMap(zoneRegion);
        // click event on the icon

        // end click event on the icon

        // Change the cursor to a pointer when the mouse is over the places layer.

        ////////////////////////////////

        break;

      // CITIES
      case map.getZoom() > 9.1 && map.getZoom() <= 13:
        // remove previous layer and source
        if (zoneRegion !== null) {
          RemoveFromMap(zoneRegion);
        }
        if (placesMarkers !== null) {
          RemoveFromMap(placesMarkers);
        }

        AddToMap(citiesmarkers);

        // click event on the icon

        // end click event on the icon

        // Change the cursor to a pointer when the mouse is over the places layer.

        ////////////////////////////////

        break;

      // PLACES
      case map.getZoom() > 13:
        console.log(map.getZoom());
        console.log("places");

        // remove previous layer and source
        if (citiesmarkers !== null) {
          RemoveFromMap(citiesmarkers);
        }

        // add current source and layer
        AddToMap(placesMarkers);

        ////////////////////////////////

        break;
    }
  });
});
