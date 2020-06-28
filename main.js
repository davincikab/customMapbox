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

var searchData = [];
var searchMarker;

var searchBar = document.getElementById('search-bar');
var result = document.getElementById('result');
var sideBar = document.getElementById('sidebar');
var mapContainer = document.getElementById('map');
var closeButton = document.getElementById('close');

// keep marker states
var visibleMarker = 'marker_continents';
var previousMarker = 'marker_continets';

// various dataUrl
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

// wait for the map to load to add data
map.on('load', function(e){
    dataSources.forEach(dataSource => getData(dataSource));
});

// fetch the bookmarks
function getData(dataSource) {
    fetch(dataSource.url)
        .then(response =>  response.json())
        .then(data => {
            createMarkers(data, dataSource.marker_type);
            updateGeocoderObject(data);
        }).catch(error => {
            console.log(error);
            // alert(error.message);
        });
}

function createMarkers(object, markerType) {
    object.features.forEach(feature => {
      addToMap(feature, markerType);
    });
  
}

// add features to searchData object
function updateGeocoderObject(data){
    searchData.push(...data.features);
}

// Search bar event listener
searchBar.addEventListener('input', function(e) {
    console.log(this.value);
    forwardGeocoder(this.value);
});

// addressSearch function
function forwardGeocoder(query) {
    // clear the results tab if it contains
    if(query == ''){
        result.innerHTML = '';
        return;
    }

    // create a document fragment to hold the results
    var docFrag = document.createDocumentFragment();
    filterData = searchData.filter(data => data.properties.title);

    // filter the data containing the query parameter
    filterData = filterData.filter(data => {
        if(
            data.properties.title
            .toLowerCase()
            .search(query.toLowerCase()) !== -1
        ) {
            return data;
        }
    });

    // limit the number of results found
    if(filterData.length > 5) {
        filterData = filterData.slice(0,5);
    }

    // create a list of items
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

    // append documentFragment to result element
    result.innerHTML = '';
    result.append(docFrag);
}

// fly o marker location
function flyToMarker() {
    if(searchMarker) {
        searchMarker.remove();
    }

    let coordinate = this.getAttribute('coord');
    let coordinates = coordinate.split(',').map(coord => parseFloat(coord));

    // update the input with clicked label
    searchBar.value = this.textContent;

    // Create  locator marker
    searchMarker = new mapboxgl.Marker().setLngLat(
        coordinates
    );

    // fly to the give location
    map.flyTo({
        center:coordinates,
        essential:true,
        zoom:12
    });
    
    searchMarker.addTo(map);

    // close the geocoder result
    result.innerHTML = '';
}

// add markers to map
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

    // add interectivity to the markers
      el.addEventListener('click', function() {
        const title = feature.properties.title;

        toggleSideBar("open");
        let previousHeader = document.querySelector('#sidebar h1');

        if(previousHeader) {
            previousHeader.remove();
        }

        let element = document.createElement('h1');
        element.className = 'title';
        element.textContent = title;

        sideBar.appendChild(element);
      });

    //   add marker to map
      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
    
      mymarker.addTo(map);
}

// fade in layers
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
closeButton.addEventListener('click', function(e) {
    toggleSideBar("close");
});

// close or open sideBar
function toggleSideBar(action) {
    if(action == "open") {
        sideBar.classList.add('visible');
        mapContainer.classList.add('shorten');

        return ;
    }

    sideBar.classList.toggle('visible');
    mapContainer.classList.toggle('shorten');
}