# Flight Tracking Application 🛫

A real-time flight tracking web application built with Node.js, Express, and Leaflet maps for GEOG 576.

## Features ✨

- **Real-time flight data** from AirLabs API
- **Interactive Leaflet map** with aircraft markers
- **Geolocation detection** to find nearby airports
- **Detailed flight information** in popup windows
- **Responsive web interface** with flight data table
- **Airport selection** dropdown for different locations

## Technologies Used 🛠️

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Mapping**: Leaflet.js with OpenStreetMap
- **APIs**: AirLabs Flight API, IP Geolocation API
- **Deployment**: AWS EC2, Apache HTTP Server

## Project Structure 📁

```
flight_tracking/
├── server/
│   ├── server.js           # Main Express server
│   └── server_part1.js     # Backup version
├── web/
│   ├── index.html          # Main HTML page
│   ├── app.js             # Client-side JavaScript
│   ├── styles2.css        # Application styling
│   └── icons8-plane-24.png # Aircraft icon
├── package.json           # Node.js dependencies
└── .env                   # Environment variables (not in repo)
```

## API Endpoints 🔗

- `GET /hello` - Health check endpoint
- `GET /flights/:airport_code` - Get flights for specific airport
- `GET /nearbyAirports/:latitude,:longitude` - Find nearby airports

## Features Overview 📋

### Interactive Map
- Real-time aircraft positions with custom airplane icons
- Click on aircraft for detailed flight information
- User location detection with marker and radius
- Zoom and pan controls

### Flight Information
- Aircraft registration numbers
- Flight numbers and airlines
- Origin and destination airports
- Altitude, speed, and direction
- Flight status (en-route, landed, etc.)

### Airport Selection
- Nearby airport detection based on user location
- Manual airport selection via dropdown
- Support for major airports (MSN, ORD, MKE, ATL)

## Course Information 📚

This project was developed for **GEOG 576** - GIS Programming and Development at the University of Wisconsin-Madison.

**Assignment**: Lab 6 - Flight Tracking Application with Real-time Data Integration

## Author 👨‍💻

**Ethan Kalchik**
- Course: GEOG 576
- University: University of Wisconsin-Madison
- Email: kalchikethan@gmail.com

## License 📄

This project is for educational purposes as part of GEOG 576 coursework.