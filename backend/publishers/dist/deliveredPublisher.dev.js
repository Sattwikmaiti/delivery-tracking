"use strict";

var dotenv = require('dotenv');

var amqplib = require('amqplib');

dotenv.config();
AMQP_SERVER = "amqps://lmfgllcl:38RrOms-LLrn6HMUwLJL6OSD8MBzsuFH@woodpecker.rmq.cloudamqp.com/lmfgllcl";

var deliveredPublisher = function deliveredPublisher(data) {
  var connection, channel, message;
  return regeneratorRuntime.async(function deliveredPublisher$(_context) {
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
            status: 'delivered'
          };
          channel.publish('parcel-tracking', 'parcel.delivered', Buffer.from(JSON.stringify(message)));
          console.log("delivered");
          _context.next = 14;
          return regeneratorRuntime.awrap(channel.close());

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(connection.close());

        case 16:
          return _context.abrupt("return", Promise.resolve());

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", Promise.reject(_context.t0));

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

module.exports = deliveredPublisher;