"use strict";

var dotenv = require('dotenv');

var amqplib = require('amqplib');

dotenv.config();
AMQP_SERVER = "amqps://lmfgllcl:38RrOms-LLrn6HMUwLJL6OSD8MBzsuFH@woodpecker.rmq.cloudamqp.com/lmfgllcl";

var onroadPublisher = function onroadPublisher(data) {
  var connection, channel, message, t;
  return regeneratorRuntime.async(function onroadPublisher$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(amqplib.connect(AMQP_SERVER));

        case 3:
          connection = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(connection.createChannel());

        case 6:
          channel = _context.sent;
          console.log("entered");
          _context.next = 10;
          return regeneratorRuntime.awrap(channel.assertExchange('parcel-tracking', 'topic', {
            durable: false
          }));

        case 10:
          if (data.currentLocation.stateCapital) {
            message = {
              deliveryId: data.deliveryId,
              userId: data.userId,
              orderId: data.orderId,
              pickupLocation: data.pickupLocation,
              currentLocation: data.currentLocation,
              status: 'onroad'
            };
            console.log("onroadmessage", message);
            t = channel.publish('parcel-tracking', 'parcel.onroad', Buffer.from(JSON.stringify(message)));
            console.log("onroad");
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(channel.close());

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(connection.close());

        case 15:
          return _context.abrupt("return", Promise.resolve());

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", Promise.reject(_context.t0));

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

module.exports = onroadPublisher;