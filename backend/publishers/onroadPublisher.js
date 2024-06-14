const dotenv = require('dotenv');
const amqplib = require('amqplib');

dotenv.config();

const onroadPublisher = async (data) => {
  try {
    const connection = await amqplib.connect(process.env.AMQP_SERVER);
    const channel = await connection.createChannel();

    await channel.assertExchange('parcel-tracking', 'topic', { durable: false });
    const message = { deliveryId:data.deliveryId,userId:data.userId,orderId:data.orderId,pickupLocation:data.pickupLocation,currentLocation:data.currentLocation, status: 'onroad' };
    channel.publish('parcel-tracking', 'parcel.onroad', Buffer.from(JSON.stringify(message)));

    await channel.close();
    await connection.close();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = onroadPublisher;
