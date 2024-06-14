// import React from "react";
// import socket from "./socket";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "./App.css";
// function App() {
//   const [parcels, setParcel] = React.useState([{}]);
//   const position = [26.8500, 80.9500];
//   React.useEffect(() => {
//     socket.on("parcel", (data) => setParcel(data));
//   });
//   return (
//     <div>
//       <div id="map" style={{ height: "500px", width: "600px" }}>
//         <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
//           <TileLayer
//             attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//         </MapContainer>
//       </div>
//       {parcels?.map((parcel, index) => (
//     <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//       <div>ID: {parcel?._id}</div>
//       <div>Delivery ID: {parcel?.deliveryId}</div>
//       <div>User ID: {parcel?.userId}</div>
//       <div>Order ID: {parcel?.orderId}</div>
//       <div>Status: {parcel?.status}</div>
//       <div>Pickup Location: {parcel?.pickupLocation?.location}</div>
//       <div>
//         Current Location: {parcel?.currentLocation?.stateCapital}, {parcel?.currentLocation?.coordinates?.latitude}, {parcel?.currentLocation?.coordinates?.longitude}
//       </div>
//     </div>
//   ))}
//     </div>
//   );
// }
// export default App;
"use strict";