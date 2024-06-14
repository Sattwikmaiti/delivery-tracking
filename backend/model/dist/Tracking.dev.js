"use strict";

var mongoose = require('mongoose');

var trackingSchema = new mongoose.Schema({
  name: String,
  status: String
});
var Track = mongoose.model("Track", trackingSchema);
module.exports = Track;