const mongoose = require('mongoose');
const { Schema } = mongoose;

const deliveryAgentSchema = new Schema({
  agentId: String,
  deliveryId: {type:String,default:""},
  operatingLocation: {
    location: String,
   
  },
  status: {
    type: String,
    enum: ['free', 'booked'],
    default: 'free'
  }
});

const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);

module.exports = DeliveryAgent;
