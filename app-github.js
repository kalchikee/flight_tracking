// Name:            app-github.js
//
// Description:     GitHub Pages compatible version - calls AirLabs API directly
//
// Author:          Bucky Badger

console.log("app-github.js() starting ... ")

// AirLabs API configuration
const AIRLABS_API_KEY = '12eb6ad3-ae0c-4d58-9e71-753d4514181e';
const AIRLABS_BASE_URL = 'https://airlabs.co/api/v9';

// Get lat/lng from local storage variables
console.log("app-github.js() localStorage (lat): " + localStorage.getItem('latitude'))
console.log("app-github.js() localStorage (lng):" + localStorage.getItem('longitude'))

var myLatitude = localStorage.getItem('latitude')
var myLongitude = localStorage.getItem('longitude')

// Verify location variables have values.  If not, set default lat/lon values
if (myLatitude == null || myLongitude == null) {
    console.log(" setting latitude, longitude to default values ...")

    localStorage.setItem('latitude', 43.0637)
    localStorage.setItem('longitude', -89.2043)

    myLatitude = localStorage.getItem('latitude')
    myLongitude = localStorage.getItem('longitude')
}

console.log("app-github.js() myLat/Lng: " + myLatitude + " " + myLongitude)

const tableBody = document.getElementById('table_body')

// Default Airport Code
defaultAirportCode = "MSN"

// Add Flight data to Map
async function showFlights() {
    try {
        console.log("showFlights(): calling AirLabs API directly")
        
        // Check if map is available
        if (!window.map) {
            console.log("showFlights(): Map not ready, waiting 1 second...")
            setTimeout(showFlights, 1000);
            return;
        }
        
        // Call AirLabs API directly for flights
        const flightURL = `${AIRLABS_BASE_URL}/flights?dep_iata=${defaultAirportCode}&api_key=${AIRLABS_API_KEY}`
        console.log("flightURL: " + flightURL)

        const response = await fetch(flightURL)
        const json = await response.json()

        console.log("Flight data received:", json)

        var planeIcon = L.icon({
            iconUrl: 'icons8-plane-24.png',
            iconSize: [24, 24],
            shadowSize: [26, 26],
            iconAnchor: [22, 22],
            popupAnchor: [-3, -24]
        });
        
        if (json.response && json.response.length > 0) {
            for (let i = 0; i < json.response.length; i++) {
                const flight = json.response[i];
                
                // Only add flights with valid coordinates
                if (flight.lat && flight.lng) {
                    console.log("Adding marker to map. LatLng: " + flight.lat + "," + flight.lng)

                    // Create popup content with flight information
                    const popupContent = `
                        <div style="font-family: Arial, sans-serif; min-width: 200px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">${flight.flight_iata || flight.flight_icao || 'Unknown Flight'}</h4>
                            <p style="margin: 5px 0;"><strong>Registration:</strong> ${flight.reg_number || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Aircraft:</strong> ${flight.aircraft_icao || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Airline:</strong> ${flight.airline_iata || flight.airline_icao || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>From:</strong> ${flight.dep_iata || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>To:</strong> ${flight.arr_iata || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Altitude:</strong> ${flight.alt || 'N/A'} ft</p>
                            <p style="margin: 5px 0;"><strong>Speed:</strong> ${flight.speed || 'N/A'} kts</p>
                            <p style="margin: 5px 0;"><strong>Direction:</strong> ${flight.dir || 'N/A'}°</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> ${flight.status || 'N/A'}</p>
                        </div>
                    `;

                    const marker = L.marker([flight.lat, flight.lng], {icon: planeIcon})
                        .addTo(window.map)
                        .bindPopup(popupContent);
                }
            }
        }
    } catch (error) {
        console.error("Error fetching flights: " + error.stack) 
    }
}

// Get Flights for Specified Airport
const getFlights = async function (airportCode) {
    try {
        console.log("getFlights() airportCode: " + airportCode)
        
        if (typeof airportCode == 'undefined') {
            airportCode = 'MSN'
        }

        console.log("getFlights() airport code: " + airportCode)

        // Call AirLabs API directly
        const api_url = `${AIRLABS_BASE_URL}/flights?dep_iata=${airportCode}&api_key=${AIRLABS_API_KEY}`
        
        console.log("getFlights() api_url: " + api_url)
       
        const response = await fetch(api_url);   
        const json = await response.json();

        console.log("Flight API response:", json);

        if (!json.response || json.response.length < 1) {
            alert("No flights found for airport " + airportCode)
        } else {
            // Populate the Flight Table with Active Flights
            populateFlightTable(json)
        }
  
    } catch (error) {
        console.error("getFlights() Error: " + error.stack)
    }
}

// Get nearby airports
const getNearbyAirports = async function () {
    try {
        console.log("getNearbyAirports() ...")
        
        // Call AirLabs API for nearby airports - increased distance for better results
        const api_url = `${AIRLABS_BASE_URL}/airports?lat=${myLatitude}&lng=${myLongitude}&distance=100&api_key=${AIRLABS_API_KEY}`

        console.log("getNearbyAirports() api_url: " + api_url)
       
        const response = await fetch(api_url);
        const json = await response.json();

        console.log("Nearby airports:", json);

        if (!json.response || json.response.length < 1) {
            alert("No nearby airports found")
        } else {
            getNearbyAirportResults(json)
        }

    } catch (error) {
        console.error("getNearbyAirports() Error: " + error.stack)
        
        // Find the element on page where id='nearbyAirport'
        var x = document.getElementById("nearbyAirport");
        x.innerHTML = "Error getting nearby airport. Check console for details."
    }
}

// Initialize the page
console.log("Calling showFlights() ...")
showFlights()

console.log("Calling getNearbyAirports() ...")
getNearbyAirports()

console.log("Calling getFlights() ...")
getFlights()

// Populate flight table with attributes
const populateFlightTable = (json) => {
    console.log("populateFlightTable ...")

    var tableCell

    // Clear existing table content
    tableBody.innerHTML = '';

    // Check if we have valid response
    if (!json.response || json.response.length < 1) {
        const tableRow = document.createElement('tr')
        tableCell = document.createElement("td")
        tableCell.colSpan = 5;
        tableCell.append('No flights found')
        tableRow.append(tableCell)
        tableBody.append(tableRow)
    } else {
        // Loop through the response
        for (let i = 0; i < json.response.length; i++) {
            const flight = json.response[i];

            console.log("reg_number: " + flight.reg_number + " altitude: " + flight.alt)

            const tableRow = document.createElement('tr')
            tableRow.className = "departures"

            // Altitude
            tableCell = document.createElement("td")
            tableCell.append(flight.alt || 'N/A')
            tableRow.append(tableCell)

            // Aircraft Registration #
            tableCell = document.createElement('td')
            tableCell.append(flight.reg_number || 'N/A')
            tableCell.className = "departures"
            tableRow.append(tableCell)

            // Direction
            tableCell = document.createElement("td")
            tableCell.append(flight.dir || 'N/A')
            tableRow.append(tableCell)

            // Latitude
            tableCell = document.createElement("td")
            tableCell.append(flight.lat || 'N/A')
            tableRow.append(tableCell)

            // Longitude
            tableCell = document.createElement("td")
            tableCell.append(flight.lng || 'N/A')
            tableRow.append(tableCell)

            tableBody.append(tableRow)
        }
    }
}

// Get the nearby airport results
const getNearbyAirportResults = (json) => {
    try {
        console.log("getNearbyAirportResults ...")

        var airportName = 'Unknown';
        var airportIataCode = 'N/A';

        if (json.response && json.response.length > 0) {
            // Find the first airport with a valid IATA code
            let foundAirport = null;
            for (let i = 0; i < json.response.length; i++) {
                if (json.response[i].iata_code && json.response[i].iata_code !== null) {
                    foundAirport = json.response[i];
                    break;
                }
            }
            
            if (foundAirport) {
                airportName = foundAirport.name
                airportIataCode = foundAirport.iata_code
            } else {
                // Use first airport even without IATA code
                airportName = json.response[0].name
                airportIataCode = json.response[0].icao_code || 'N/A'
            }
            
            console.log("airport name: " + airportName + " iata_code: " + airportIataCode)
        }

        // Find the element on page where id='nearbyAirport'
        var x = document.getElementById("nearbyAirport");
        x.innerHTML = "<br />Nearby Airport: " + airportName + " (" + airportIataCode + ")"

    } catch (error) {
        console.error("Error getting nearby airport data: " + error)
        
        var x = document.getElementById("nearbyAirport");
        x.innerHTML = "<br />Nearby Airport: Error loading data"
    }
}