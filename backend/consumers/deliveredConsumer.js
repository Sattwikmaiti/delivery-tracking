 // No need for this if using amqplib directly
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Track = require("../model/Tracking");
const amqplib = require("amqplib");
const Delhivery=require('../model/Delhivery')
dotenv.config();
AMQP_SERVER="amqps://lmfgllcl:38RrOms-LLrn6HMUwLJL6OSD8MBzsuFH@woodpecker.rmq.cloudamqp.com/lmfgllcl"
MONGODB_URL = "mongodb+srv://maitisattwik:jyuthu@cluster0.nbvfpuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to database"));

(async () => {
  try {
    const connection = await amqplib.connect(AMQP_SERVER);
    const channel = await connection.createChannel();

    await channel.assertExchange('parcel-tracking', 'topic', { durable: false });
    const q = await channel.assertQueue('', { durable: false });
    channel.bindQueue(q.queue, 'parcel-tracking', '*.delivered');

    channel.prefetch(1);

    channel.consume(q.queue, async (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());

        try {
          const deliveredParcel = await Delhivery.updateOne(
            { deliveryId: messageContent.deliveryId },
            { 
              $set: { 
                currentLocation: messageContent.currentLocation,
                status: messageContent.status 
              }
            }
          );
      

          console.log("parcel was delivered:", deliveredParcel);
          channel.ack(msg);
        } catch (err) {
          console.error("Error updating parcel status:", err);
          channel.nack(msg);
        }
      }
    }, {
      noAck: false
    });

    console.log("Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.error("Error setting up RabbitMQ:", err);
  }
})();
