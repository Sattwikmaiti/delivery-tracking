const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  agentId: String,
  deliveryId: String,
  currentLocation: {
    stateCapital: String,
  
  },
  pickupLocation: {
    stateCapital: String,
    
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
