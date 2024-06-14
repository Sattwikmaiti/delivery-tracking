"use strict";

var dotenv = require('dotenv');

var mongoose = require('mongoose');

var Track = require('../model/Tracking');

var amqplib = require('amqplib');

var Delhivery = require('../model/Delhivery');

dotenv.config();
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  return console.log('Connected to database');
});

(function _callee2() {
  var connection, channel, q;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(amqplib.connect(process.env.AMQP_SERVER));

        case 3:
          connection = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(connection.createChannel());

        case 6:
          channel = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(channel.assertExchange('parcel-tracking', 'topic', {
            durable: false
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(channel.assertQueue('', {
            durable: false
          }));

        case 11:
          q = _context2.sent;
          channel.bindQueue(q.queue, 'parcel-tracking', '*.shipping');
          channel.prefetch(1);
          channel.consume(q.queue, function _callee(msg) {
            var messageContent;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (msg !== null) {
                      messageContent = JSON.parse(msg.content.toString());

                      try {
                        // const newParcel = new Delhivery(messageContent);
                        // const savedParcel = await newParcel.save();
                        // console.log('shipped parcel:', savedParcel);
                        channel.ack(msg);
                      } catch (err) {
                        console.error('Error saving parcel:', err);
                        channel.nack(msg);
                      }
                    }

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }, {
            noAck: false
          });
          console.log('Waiting for messages. To exit press CTRL+C');
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error('Error setting up RabbitMQ:', _context2.t0);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
})();