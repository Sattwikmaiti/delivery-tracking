"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var logSchema = new Schema({
  agentId: String,
  deliveryId: String,
  currentLocation: {
    stateCapital: String
  },
  pickupLocation: {
    stateCapital: String
  },
  timestamp: {
    type: Date,
    "default": Date.now
  }
});
var Log = mongoose.model('Log', logSchema);
module.exports = Log;