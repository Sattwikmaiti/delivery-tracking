const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Track = require('../model/Tracking');
const amqplib = require('amqplib');
const Delhivery=require('../model/Delhivery')

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to database'));

(async () => {
  try {
    const connection = await amqplib.connect(process.env.AMQP_SERVER);
    const channel = await connection.createChannel();

    await channel.assertExchange('parcel-tracking', 'topic', { durable: false });
    const q = await channel.assertQueue('', { durable: false });
    channel.bindQueue(q.queue, 'parcel-tracking', '*.onroad');


    channel.prefetch(1);

   
    channel.consume(q.queue, async (msg) => {
      
      
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());

        try {
         
          channel.ack(msg);
          await Delhivery.updateOne(
            { deliveryId: messageContent.deliveryId },
            { 
              $set: { 
                currentLocation: messageContent.currentLocation,
                status: messageContent.status 
              }
            }
          );

          // console.log('parcel is on road:', onroadParcel);
          
        } catch (err) {
          console.error('Error updating parcel status:', err);
          channel.nack(msg);
        }
      }
    }, {
      noAck: false
    });

    console.log('Waiting for messages. To exit press CTRL+C');
  } catch (err) {
    console.error('Error setting up RabbitMQ:', err);
  }
})();
