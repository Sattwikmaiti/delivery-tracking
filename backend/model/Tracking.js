const mongoose=require('mongoose')
const trackingSchema = new mongoose.Schema({
  
  name: String,
  status: String,
});

const Track = mongoose.model("Track", trackingSchema);
module.exports = Track;
