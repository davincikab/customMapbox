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
  
  // add geocoder 
var geocoder = new MapboxGeocoder({
    accessToken:mapboxgl.accessToken,
    mapboxgl:mapboxgl
});
  

// map.addControl(geocoder);

var searchData = [];
var searchMarker;
var visibleMarker = 'marker_continents';
var previousMarker = 'marker_continets';

var dataSources = [
  {url:'data/cities.json', marker_type:"marker_cities"},
  {url:'data/places.json', marker_type:"marker_places"},
  {url:'data/countries.json',marker_type:"marker_countries"},
  {url:'data/continents.json',marker_type:"marker_continents"},
  {url:'data/region_country.json',marker_type:"marker_region_country"},
  {url:'data/zone_continents.json' ,marker_type:"marker_zone_continents"},
  {url:'data/zone_country.json', marker_type:"marker_zone_country"},
  {url:'data/zone_region.json',marker_type:"marker_zone_region"}
];

dataSources.forEach(dataSource => getData(dataSource));

function getData(dataSource) {
    fetch(dataSource.url)
        .then(response =>  response.json())
        .then(data => {
            createMarkers(data, dataSource.marker_type);
            updateGeocoderObject(data);
        }).catch(error => {
            console.log(error);
            alert(error.message);
        });
}

function createMarkers(object, markerType) {
    object.features.forEach(feature => {
      addToMap(feature, markerType);
    });
  
}

function updateGeocoderObject(data){
    searchData.push(...data.features);
}

$('#search-bar').on('input', function(e) {
    console.log($(this).val());
    forwardGeocoder($(this).val());
});

function forwardGeocoder(query) {
    var docFrag = document.createDocumentFragment();
    filterData = searchData.filter(data => data.properties.title);
    console.log(filterData);
    filterData = filterData.filter(data => {
        if(
            data.properties.title
            .toLowerCase()
            .search(query.toLowerCase()) !== -1
        ) {
            return data;
        }
    });

    // reduce the dat items
    if(filterData.length > 5) {
        filterData = filterData.slice(0,5);
    }

    filterData.forEach(data => {
        if(
            data.properties.title
            .toLowerCase()
            .search(query.toLowerCase()) !== -1
        ) {
            var list = document.createElement('li');
            list.className = 'address'
            list.setAttribute('coord', data.geometry.coordinates);
            list.textContent = data.properties.title;
            list.addEventListener('click',flyToMarker);

            docFrag.appendChild(list);
            return data;
        }
    });

    // create a list of element
    $('#result').empty();
    $('#result').append(docFrag);
}

function flyToMarker() {
    if(searchMarker) {
        searchMarker.remove();
    }

    let coordinate = $(this).attr('coord');
    let coordinates = coordinate.split(',').map(coord => parseFloat(coord));

    // update the input with clicked label
    $('#search-bar').val($(this).text());

    // Create  marker
    searchMarker = new mapboxgl.Marker().setLngLat(
        coordinates
    );

    map.flyTo({
        center:coordinates,
        essential:true,
        zoom:12
    });
    
    searchMarker.addTo(map);

    // close the geocoder result
    $('#result').toggleClass('d-none');
}

function addToMap(feature, marker_type) {
    var el = document.createElement("div");
      el.className = "marker " + marker_type;

      var imageUrl = feature.properties.icon.slice(3,);
      el.style.backgroundImage = "url(" + imageUrl + ")";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      el.style.width = "40px"; //marker.properties.iconSize[0] + 'px';
      el.style.height = "40px"; //marker.properties.iconSize[1] + 'px';

      if(marker_type != 'marker_continents') {
        el.className = "marker marker-fade-in " + marker_type;
      }

      el.addEventListener('click', function() {
        const title = feature.properties.title;

        $("#sidebar").addClass("visible");
        $("#map").addClass("shorten");

        $(".visible h1").remove();
        $("<h1 class='title' >" + title + "</h1>").appendTo(".visible");
      });

      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
    
      mymarker.addTo(map);
}

function toggleLayer(className) {
    visibleMarker = className;

    if(previousMarker == visibleMarker) {

    } else {
        const divs = document.querySelectorAll('.' +previousMarker);
        divs.forEach(div => {
            div.classList.add('marker-fade-in');     
        });

        const divCurrent = document.querySelectorAll('.' +className);
        divCurrent.forEach(div => {
            div.classList.remove('marker-fade-in');     
        });
        
        previousMarker = visibleMarker;
  
    }
    
}

// Zoom function listener
map.on('zoomend', function(e) {
    var zoom = map.getZoom();
    console.log(zoom);
    switch (true) {
        case zoom <= 2.1:
            console.log(zoom);
            toggleLayer('marker_continents');
            break;
        case zoom > 2.1 && zoom <= 4.5:
            toggleLayer('marker_zone_continents');
            break;
        case zoom > 4.5 && zoom <= 5.7:
            toggleLayer('marker_countries');
            break;
        case zoom > 5.7 && zoom <= 7:
            toggleLayer('marker_zone_country');
            break;
        case zoom > 7 && zoom <= 8:
            toggleLayer('marker_region_country');
            break;
        case zoom > 8 && zoom <= 9.1:
            toggleLayer('marker_zone_region');
            break;
        case zoom > 9.1 && zoom <= 13:
            toggleLayer('marker_cities');
            break;
        case zoom > 13:
            toggleLayer('marker_places');
            break;
        default:
            break;
    }
});


// close 
$('#close').on('click', function(e) {
    $("#sidebar").toggleClass("visible");
    $("#map").toggleClass("shorten");
});