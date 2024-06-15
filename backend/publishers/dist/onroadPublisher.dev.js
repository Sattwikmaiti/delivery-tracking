"use strict";

var dotenv = require('dotenv');

var amqplib = require('amqplib');

dotenv.config();

var onroadPublisher = function onroadPublisher(data) {
  var connection, channel, message;
  return regeneratorRuntime.async(function onroadPublisher$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(amqplib.connect(process.env.AMQP_SERVER));

        case 3:
          connection = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(connection.createChannel());

        case 6:
          channel = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(channel.assertExchange('parcel-tracking', 'topic', {
            durable: false
          }));

        case 9:
          if (data.currentLocation.stateCapital) {
            message = {
              deliveryId: data.deliveryId,
              userId: data.userId,
              orderId: data.orderId,
              pickupLocation: data.pickupLocation,
              currentLocation: data.currentLocation,
              status: 'onroad'
            };
            console.log("mess", message);
            channel.publish('parcel-tracking', 'parcel.onroad', Buffer.from(JSON.stringify(message)));
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(channel.close());

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(connection.close());

        case 14:
          return _context.abrupt("return", Promise.resolve());

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", Promise.reject(_context.t0));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

module.exports = onroadPublisher;