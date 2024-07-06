"use strict";

var socketIo = require("socket.io");

var express = require("express");

var http = require("http");

var mongoose = require("mongoose");

var Track = require("../model/Tracking");

var dotenv = require("dotenv");

var Delhivery = require('../model/Delhivery');

dotenv.config();
var port = process.env.WS_PORT || 2500;
MONGODB_URL = "mongodb+srv://maitisattwik:jyuthu@cluster0.nbvfpuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  return console.log("Connected to database");
});
var app = express();
var server = http.createServer(app);
var io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
var interval;

var findParcel = function findParcel(socket) {
  var parcels;
  return regeneratorRuntime.async(function findParcel$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Delhivery.find());

        case 3:
          parcels = _context.sent;
          socket.emit("parcel", parcels);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching parcels:", _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

io.on("connection", function (socket) {
  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(function () {
    return findParcel(socket);
  }, 1000);
  socket.on("disconnect", function () {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
server.listen(port, function () {
  return console.log("Listening on port ".concat(port));
});
module.exports = server;