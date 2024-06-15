
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "./socket";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  LayerGroup,
  Marker,
  Circle,
  Popup,
} from "react-leaflet";
import "./App.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
function App() {
  const [parcel, setParcel] = useState();
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [city, setCity] = useState([]);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const position = [26.85, 80.95];

  const getPathFromEndpoint = async () => {
    try {
      const response = await axios.post("http://localhost:8000/path", {
        source: "Delhi", // Replace with actual source city
        destination: "Mumbai", // Replace with actual destination city
      });
      const data = response.data;
      const res = data.map((co) => [parseFloat(co.lat), parseFloat(co.lng)]);

     
      const rest = data.map((co) => co.city);

      setCity(rest);
      setPathCoordinates(res);
      console.log("res", rest);
    } catch (error) {
      console.error("Error fetching path:", error);
    }
  };

  useEffect(() => {
    socket.on("parcel", (data) => setParcel(data[data.length-1]));
    getPathFromEndpoint();
  }, []);

  useEffect(() => {


    animateMarker();
    

  }, [pathCoordinates]); // Trigger animation when pathCoordinates change
   
  useEffect(() => {
    const sendOnRoadStream = async () => {
       
        try {
          if(city[currentPositionIndex])
           { 

            console.log(`Publishing : ${city[currentPositionIndex]}`)
            await axios.post("http://localhost:8000/onroad-stream", {
            userId: "Sattwik",
            agentId: "Raju",
            orderId: "Sattwik-order-1",
            deliveryId: "sattwik-del-591",
            pickupLocation: {
              location: "Mumbai"
            },
            currentLocation: {
              stateCapital: city[currentPositionIndex]
            }
          });


          if(city[currentPositionIndex]==="Mumbai")
              {
                alert("Your Parcel Has Arrived.Click ok to Pick Up Successfully")
              }

        
          console.log(`Published : ${city[currentPositionIndex]}`)
          console.log("city", city[currentPositionIndex]);}
        } catch (error) {
          console.error("Error sending onroad-stream:", error);
        }
       
      

    };
  
    sendOnRoadStream();
  }, [city, currentPositionIndex]);
  const animateMarker = () => {

    const interval = setInterval(() => {
      setCurrentPositionIndex((prevIndex) => {
        if (prevIndex < pathCoordinates.length - 1) {
          return prevIndex+1;
        } else {
          clearInterval(interval);
          
          return prevIndex;
        }
      });
    }, 8000); 

    return () => clearInterval(interval);
  };
  return (
    <div>
      {pathCoordinates.length > 0 ? (
        <div className="together">
          <div id="map" style={{ height: "100vh", width: "600px" }}>
            <MapContainer center={position} zoom={5} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
                
              <Polyline positions={pathCoordinates} color="green" />
         
   <Marker position={pathCoordinates[currentPositionIndex]}></Marker>
       <CircleMarker center={pathCoordinates[currentPositionIndex]}>
                <Popup>
                  {pathCoordinates[currentPositionIndex][0]},
                  {pathCoordinates[currentPositionIndex][1]}
                </Popup>
              </CircleMarker>


     <CircleMarker center={pathCoordinates[pathCoordinates.length-1]}  fillColor="red" radius={20}> 
                <Popup>
                  {pathCoordinates[currentPositionIndex][0]},
                  {pathCoordinates[currentPositionIndex][1]}
                </Popup>
              </CircleMarker>
             
            </MapContainer>
          </div>
          <div className="parcels">
            {
              <p id="id">
               
                <div>Delivery ID: {parcel?.deliveryId}</div>
                <div>User ID: {parcel?.userId}</div>
                <div>Order ID: {parcel?.orderId}</div>
                <div>Status: {parcel?.status}</div>
                <div>Pickup Location: {parcel?.pickupLocation.location}</div>
                <div>
                  Current Location: {parcel?.currentLocation.stateCapital}
                </div>
                </p>
            
            }
          </div>
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
}

export default App;
