document.getElementById('start-tracking').addEventListener('click', () => {
    const riderName = document.getElementById('name').value;
    if (!riderName) {
        alert('Please enter your name.');
        return;
    }
    document.getElementById('name').value = '';

    // Initial location update
    getLocationAndUpdate(riderName);

    // Start updating location every 15 seconds
    setInterval(() => getLocationAndUpdate(riderName), 15000);
});

// Function to send location to the server
function sendLocation(name, latitude, longitude) {
    fetch('http://localhost:5000/update-location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, latitude, longitude })
    })
    .then(response => response.json())
    .then(data => console.log('Location updated:', data))
    .catch(error => console.error('Error updating location:', error));
}

// Function to get and send location
function getLocationAndUpdate(name) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            sendLocation(name, latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 10000, // 10 seconds
            timeout: 5000 // 5 seconds
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Initialize PubNub
const pubnub = new PubNub({
    publishKey: 'pub-c-cfee3158-378c-4920-a60c-264321565feb',
    subscribeKey: 'sub-c-a73ecf59-d684-4f3f-9c2f-b4425f0e66bc'
});

// Initialize Google Maps
let map;
let markers = {};

function initMap() {
    const mapOptions = {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        styles: [
            { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
            { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
            { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
            { "featureType": "administrative.land_parcel", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
            { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
            { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
            { "featureType": "poi", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] },
            { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
            { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] },
            { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
            { "featureType": "poi.park", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] },
            { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
            { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
            { "featureType": "road.arterial", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
            { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
            { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
            { "featureType": "road.highway", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
            { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
            { "featureType": "road.local", "stylers": [{ "visibility": "off" }] },
            { "featureType": "road.local", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
            { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
            { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
            { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
            { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
        ]
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Fetch initial locations from server
    fetch('http://localhost:5000/locations')
        .then(response => response.json())
        .then(locations => {
            if (!Array.isArray(locations)) {
                throw new Error('Expected an array of locations');
            }
            locations.forEach(location => {
                const { name, latitude, longitude } = location;
                const marker = new google.maps.Marker({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: `Rider ${name}`
                });
                markers[name] = marker;
            });
        })
        .catch(error => console.error('Error fetching initial locations:', error));
}

// Listen for real-time location updates
pubnub.addListener({
    message: function(event) {
        const { name, latitude, longitude } = event.message;
        if (markers[name]) {
            markers[name].setPosition(new google.maps.LatLng(latitude, longitude));
        } else {
            const marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: `Rider ${name}`
            });
            markers[name] = marker;
        }
    }
});
pubnub.subscribe({
    channels: ['rider-locations']
});

// Initialize the map after the window has loaded
window.onload = initMap;
