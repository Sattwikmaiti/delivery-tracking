const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const Track = require("../model/Tracking");
const dotenv = require("dotenv");
const Delhivery=require('../model/Delhivery')

dotenv.config();

const port = process.env.WS_PORT || 2500;
MONGODB_URL = "mongodb+srv://maitisattwik:jyuthu@cluster0.nbvfpuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to database"));

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let interval;

const findParcel = async (socket) => {
  try {

    
    const parcels = await Delhivery.find();
    

    socket.emit("parcel", parcels);
  } catch (err) {
    console.error("Error fetching parcels:", err);
  }
};

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => findParcel(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
