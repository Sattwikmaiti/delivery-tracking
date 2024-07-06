const dotenv = require('dotenv');
const amqplib = require('amqplib');

dotenv.config();
AMQP_SERVER="amqps://lmfgllcl:38RrOms-LLrn6HMUwLJL6OSD8MBzsuFH@woodpecker.rmq.cloudamqp.com/lmfgllcl"
const onroadPublisher = async (data) => {
  try {
    const connection = await amqplib.connect(AMQP_SERVER);
    const channel = await connection.createChannel();
   console.log("entered")
    await channel.assertExchange('parcel-tracking', 'topic', { durable: false });
    if(data.currentLocation.stateCapital)
     { 
      const message = { deliveryId:data.deliveryId,userId:data.userId,orderId:data.orderId,pickupLocation:data.pickupLocation,currentLocation:data.currentLocation, status: 'onroad' };
      console.log("onroadmessage",message)
    const t= channel.publish('parcel-tracking', 'parcel.onroad', Buffer.from(JSON.stringify(message)));
    console.log("onroad")
   
     }
    await channel.close();
    await connection.close();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = onroadPublisher;
