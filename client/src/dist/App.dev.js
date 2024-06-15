// import React, { useState, useEffect } from "react";
// import axios from 'axios'
// import socket from "./socket";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
// import "./App.css";
// function App() {
//   const [parcels, setParcel] = useState([{}]);
//   const [pathCoordinates, setPathCoordinates] = useState([]);
//   const position = [26.8500, 80.9500];
//   useEffect(() => {
//     socket.on("parcel", (data) => setParcel(data));
//   }, []);
//   const getPathFromEndpoint = async () => {
//     try {
//       const response = await axios.post('http://localhost:8000/path', {
//           source: 'Delhi', // Replace with actual source city
//           destination: 'Mumbai' // Replace with actual destination city
//       });
//       const data = await response.data;
//       setPathCoordinates(data);
//       console.log(data)
//     } catch (error) {
//       console.error('Error fetching path:', error);
//     }
//   };
//   useEffect(() => {
//     getPathFromEndpoint();
//   }, []);
//   return (
//     <div>
//       <div id="map" style={{ height: "100vh", width: "600px" }}>
//         <MapContainer center={position} zoom={5} scrollWheelZoom={false}>
//           <TileLayer
//             attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {pathCoordinates.length > 0 && (
//             <Polyline positions={pathCoordinates} color="blue" />
//           )}
//         </MapContainer>
//       </div>
//       {parcels?.map((parcel, index) => (
//         <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//           <div>ID: {parcel?._id}</div>
//           <div>Delivery ID: {parcel?.deliveryId}</div>
//           <div>User ID: {parcel?.userId}</div>
//           <div>Order ID: {parcel?.orderId}</div>
//           <div>Status: {parcel?.status}</div>
//           <div>Pickup Location: {parcel?.pickupLocation?.location}</div>
//           <div>
//             Current Location: {parcel?.currentLocation?.stateCapital}, {parcel?.currentLocation?.coordinates?.latitude}, {parcel?.currentLocation?.coordinates?.longitude}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
// export default App;
"use strict";