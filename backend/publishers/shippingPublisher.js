const dotenv = require('dotenv');
const amqplib = require('amqplib');

dotenv.config();
AMQP_SERVER="amqps://lmfgllcl:38RrOms-LLrn6HMUwLJL6OSD8MBzsuFH@woodpecker.rmq.cloudamqp.com/lmfgllcl"

const shippingPublisher = async (data) => {
  console.log("try sipping")
  try {
    const connection = await amqplib.connect(AMQP_SERVER);
    const channel = await connection.createChannel();
  console.log("sipping created")
    await channel.assertExchange('parcel-tracking', 'topic', { durable: false });
    const message = { deliveryId:data.deliveryId,userId:data.userId,orderId:data.orderId,pickupLocation:data.pickupLocation,currentLocation:data.currentLocation, status: 'shipping' };
    channel.publish('parcel-tracking', 'parcel.shipping', Buffer.from(JSON.stringify(message)));
     console.log("published")
    await channel.close();
    await connection.close();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = shippingPublisher;
