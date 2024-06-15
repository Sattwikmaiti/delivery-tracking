"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var deliveryAgentSchema = new Schema({
  agentId: String,
  deliveryId: {
    type: String,
    "default": ""
  },
  operatingLocation: {
    location: String
  },
  status: {
    type: String,
    "enum": ['free', 'booked'],
    "default": 'free'
  }
});
var DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);
module.exports = DeliveryAgent;