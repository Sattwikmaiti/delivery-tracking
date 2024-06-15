"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var deliverySchema = new Schema({
  deliveryId: {
    type: String,
    "default": ""
  },
  userId: String,
  orderId: String,
  status: {
    type: String,
    "enum": ['pending', 'shipping', 'onroad', 'reached-destination', 'delivered'],
    "default": 'pending'
  },
  pickupLocation: {
    location: String
  },
  currentLocation: {
    stateCapital: {
      type: String,
      "default": ''
    }
  }
});
var Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;