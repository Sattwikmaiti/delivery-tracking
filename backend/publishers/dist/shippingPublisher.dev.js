"use strict";

var dotenv = require('dotenv');

var amqplib = require('amqplib');

dotenv.config();

var shippingPublisher = function shippingPublisher(data) {
  var connection, channel, message;
  return regeneratorRuntime.async(function shippingPublisher$(_context) {
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
          message = {
            deliveryId: data.deliveryId,
            userId: data.userId,
            orderId: data.orderId,
            pickupLocation: data.pickupLocation,
            currentLocation: data.currentLocation,
            status: 'shipping'
          };
          channel.publish('parcel-tracking', 'parcel.shipping', Buffer.from(JSON.stringify(message)));
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

module.exports = shippingPublisher;