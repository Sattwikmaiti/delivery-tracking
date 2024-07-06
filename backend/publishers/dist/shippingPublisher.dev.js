"use strict";

var dotenv = require('dotenv');

var amqplib = require('amqplib');

dotenv.config();
AMQP_SERVER = "amqps://lmfgllcl:38RrOms-LLrn6HMUwLJL6OSD8MBzsuFH@woodpecker.rmq.cloudamqp.com/lmfgllcl";

var shippingPublisher = function shippingPublisher(data) {
  var connection, channel, message;
  return regeneratorRuntime.async(function shippingPublisher$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("try sipping");
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(amqplib.connect(AMQP_SERVER));

        case 4:
          connection = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(connection.createChannel());

        case 7:
          channel = _context.sent;
          console.log("sipping created");
          _context.next = 11;
          return regeneratorRuntime.awrap(channel.assertExchange('parcel-tracking', 'topic', {
            durable: false
          }));

        case 11:
          message = {
            deliveryId: data.deliveryId,
            userId: data.userId,
            orderId: data.orderId,
            pickupLocation: data.pickupLocation,
            currentLocation: data.currentLocation,
            status: 'shipping'
          };
          channel.publish('parcel-tracking', 'parcel.shipping', Buffer.from(JSON.stringify(message)));
          console.log("published");
          _context.next = 16;
          return regeneratorRuntime.awrap(channel.close());

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(connection.close());

        case 18:
          return _context.abrupt("return", Promise.resolve());

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", Promise.reject(_context.t0));

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 21]]);
};

module.exports = shippingPublisher;