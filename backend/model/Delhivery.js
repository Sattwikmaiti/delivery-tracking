const mongoose = require('mongoose');
const { Schema } = mongoose;

const deliverySchema = new Schema({
  deliveryId: {type:String,default:""},
  userId: String,
  orderId: String,
  status: {
    type: String,
    enum: ['pending', 'shipping', 'onroad', 'reached-destination', 'delivered'],
    default: 'pending'
  },
  pickupLocation: {
    location: String,
    coordinates: {
      latitude: String,
      longitude: String
    }
  },
  currentLocation: {
    stateCapital:  { type: String, default: '' },
    coordinates: {
      latitude: { type: String, default: '' },
      longitude: { type: String, default: '' }
    },
   
  },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
