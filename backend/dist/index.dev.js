"use strict";

var express = require("express");

var dotenv = require("dotenv");

var router = require("./routes");

var mongoose = require("mongoose");

var cors = require("cors");

dotenv.config();
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  return console.log("Connected to database");
});
var app = express();
var port = process.env.PORT || 8000; // Enable CORS for all origins

app.use(cors());
app.use(express.json());
app.use(router);
app.listen(port, function () {
  return console.log("Server listening on port ".concat(port));
});
module.exports = app;