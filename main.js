////////////////////// MAP CONFIGURATION //////////////////////
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGYxMyIsImEiOiJjazR6dTM5cWkwZHU1M3JtNTVidzl3a2FlIn0.7Q4-VQ--zVEiXYJvPNK_9g";

var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/df13/ck1rlsmwq02zq1cnqquawed30",
    center: [7.945162026843832, 19.295832786307415],
    zoom: 1.5,
    minZoom: 1,
    hash:true
});

var searchData = [];
var searchMarker;

var searchBar = document.getElementById('search-bar');
var result = document.getElementById('result');
var sideBar = document.getElementById('sidebar');
var mapContainer = document.getElementById('map');
var closeButton = document.getElementById('close');
var infoContainer = document.getElementById('info-container');

// keep marker states
var visibleMarker = 'marker_continents';
var previousMarker = 'marker_continets';

// various dataUrl
var dataSources = [
  {url:'data/cities.json', marker_type:"marker_cities", type:'cities', zoom:10},
  {url:'data/places.json', marker_type:"marker_places", type:'Places', zoom:13.5},
  {url:'data/countries.json',marker_type:"marker_countries", type:'Countries', zoom:5.1},
  {url:'data/continents.json',marker_type:"marker_continents", type:'Continent', zoom:1.5},
  {url:'data/region_country.json',marker_type:"marker_region_country", type:'Region Country', zoom:7.5},
  {url:'data/zone_continents.json' ,marker_type:"marker_zone_continents", type:'Zone Continents', zoom:3.5},
  {url:'data/zone_country.json', marker_type:"marker_zone_country", type:'Zone Country', zoom:6.5},
  {url:'data/zone_region.json',marker_type:"marker_zone_region", type:'Zone Region', zoom:8.5}
];

// wait for the map to load to and add data
map.on('load', function(e){
    dataSources.forEach(dataSource => getData(dataSource));
});

// fetch the bookmarks
function getData(dataSource) {
    fetch(dataSource.url)
        .then(response =>  response.json())
        .then(data => {
            createMarkers(data, dataSource.marker_type);
            updateGeocoderObject(data, dataSource.zoom, dataSource.type);
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
function updateGeocoderObject(data, zoom, type){
    // add property zoom level to the features
    data.features = data.features.map(feature => {
        feature.properties.type = type;
        feature.properties.zoom = zoom;

        return feature;
    });

    console.log(data);
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

    if(filterData.length == 0) {
        result.innerHTML = '<small><b>No result found<b></small>';
        return;
    }

    // limit the number of results found
    if(filterData.length > 5) {
        filterData = filterData.slice(0,5);
    }

    console.log(filterData);

    // create a list of items
    filterData.forEach(data => {
        if(
            data.properties.title
            .toLowerCase()
            .search(query.toLowerCase()) !== -1
        ) {
            var list = document.createElement('li');
            list.className = 'address'
            list.setAttribute('data-coord', data.geometry.coordinates);
            list.setAttribute('data-zoom', data.properties.zoom);
            list.setAttribute('data-type', data.properties.type);
            list.setAttribute('data-title', data.properties.title);

            list.innerHTML = data.properties.title + ', '+ '<small>'+data.properties.type;+'</small>';

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
function flyToMarker(e) {
    if(searchMarker) {
        searchMarker.remove();
    }

    let coordinate = this.getAttribute('data-coord');
    let coordinates = coordinate.split(',').map(coord => parseFloat(coord));
    let title = this.getAttribute('data-title');
    let type = this.getAttribute('data-type');

    const zoom = this.getAttribute('data-zoom');

    // update the input with clicked label
    searchBar.value = this.textContent;

    var markerHighlight = document.createElement('div')
    markerHighlight.className = ('marker marker-active');
    markerHighlight.style.width = "40px";
    markerHighlight.style.height = "40px";

    // get the feature with the given name and type
    const feature = searchData.find(ft => {
        if(ft.properties.title == title && type == ft.properties.type){
            return ft;
        }
    });

    console.log(feature);
    markerHighlight.addEventListener('click', function(e){
        displayInfo(feature);
    });

    // Create  locator marker
    searchMarker = new mapboxgl.Marker(markerHighlight).setLngLat(
        coordinates
    );

    // fly to the give location
    map.flyTo({
        center:coordinates,
        essential:true,
        zoom:parseFloat(zoom)
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
        displayInfo(feature);
      });

    //   add marker to map
      var mymarker = new mapboxgl.Marker(el).setLngLat(
        feature.geometry.coordinates
      );
    
      mymarker.addTo(map);
}

// function handle click event
function displayInfo(feature) {
    const title = feature.properties.title;
    var imageUrl = feature.properties.icon.slice(3,);

    toggleSideBar("open");
    infoContainer.innerHTML = '';

    let headerElement = document.createElement('h1');
    headerElement.className = 'title';
    headerElement.textContent = title;

    let imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.className = "img-description"

    infoContainer.appendChild(headerElement);
    infoContainer.appendChild(imgElement);
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
map.on('zoom', function(e) {
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

map.on('zoomend', function(e) {
    if(searchMarker) {
        setTimeout(function(e){
            searchMarker.remove()
        }, 1500)
        
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