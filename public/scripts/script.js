document.getElementById('start-tracking').addEventListener('click', () => {
    const riderName = document.getElementById('name').value;
    if (!riderName) {
        alert('Please enter your name.');
        return;
    }
document.getElementById('name').value = ''
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

const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const markers = {};

// Fetch initial locations from server
fetch('http://localhost:5000/locations')
    .then(response => response.json())
    .then(locations => {
        if (!Array.isArray(locations)) {
            throw new Error('Expected an array of locations');
        }
        locations.forEach(location => {
            const { name, latitude, longitude } = location;
            markers[name] = L.marker([latitude, longitude]).addTo(map)
                .bindPopup(`Rider ${name}`);
        });
    })
    .catch(error => console.error('Error fetching initial locations:', error));

// Listen for real-time location updates
pubnub.addListener({
    message: function(event) {
        const { name, latitude, longitude } = event.message;
        if (markers[name]) {
            markers[name].setLatLng([latitude, longitude]);
        } else {
            markers[name] = L.marker([latitude, longitude]).addTo(map)
                .bindPopup(`Rider ${name}`);
        }
    }
});

pubnub.subscribe({
    channels: ['rider-locations']
});
