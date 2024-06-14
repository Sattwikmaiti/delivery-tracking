"use strict";

var _require = require('express'),
    Router = _require.Router;

var shippingPublisher = require('../publishers/shippingPublisher');

var onroadPublisher = require('../publishers/onroadPublisher');

var deliveredPublisher = require('../publishers/deliveredPublisher');

var router = Router();

var Delhivery = require('../model/Delhivery');

var DelhiveryAgent = require('../model/DelhiveryAgent');

router.get('/orders', function _callee(req, res) {
  var all;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Delhivery.find());

        case 2:
          all = _context.sent;
          return _context.abrupt("return", res.status(200).json(all));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post('/order', function _callee2(req, res) {
  var newDelhivery;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.body);
          newDelhivery = new Delhivery({
            deliveryId: req.body.deliveryId,
            userId: req.body.userId,
            orderId: req.body.orderId,
            pickupLocation: {
              location: req.body.pickupLocation.location,
              coordinates: {
                latitude: req.body.pickupLocation.coordinates.lat,
                longitude: req.body.pickupLocation.coordinates["long"]
              }
            }
          });
          _context2.next = 4;
          return regeneratorRuntime.awrap(newDelhivery.save());

        case 4:
          res.status(200).json(newDelhivery);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get('/allAgents', function _callee3(req, res) {
  var all;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(DelhiveryAgent.find());

        case 2:
          all = _context3.sent;
          return _context3.abrupt("return", res.status(200).json(all));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.post('/addAgent', function _callee4(req, res) {
  var newDelhivery;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(req.body);
          newDelhivery = new DelhiveryAgent({
            agentId: req.body.agentId,
            operatingLocation: {
              location: req.body.location,
              coordinates: {
                latitude: req.body.lat,
                longitude: req.body["long"]
              }
            }
          });
          _context4.next = 4;
          return regeneratorRuntime.awrap(newDelhivery.save());

        case 4:
          res.status(200).json(newDelhivery);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router.put('/order/:id', function _callee5(req, res) {
  var orderId, status;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          //orderId means db schema orderId
          orderId = req.params.id;
          status = req.body.status;
          _context5.next = 5;
          return regeneratorRuntime.awrap(Delhivery.updateOne({
            orderId: orderId
          }, {
            $set: {
              status: status
            }
          }));

        case 5:
          res.status(200).json({
            message: 'Order status updated successfully'
          });
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.put('/agent/:id', function _callee6(req, res) {
  var agentId, _req$body, deliveryId, status;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          agentId = req.params.id;
          _req$body = req.body, deliveryId = _req$body.deliveryId, status = _req$body.status;
          _context6.next = 5;
          return regeneratorRuntime.awrap(DelhiveryAgent.updateOne({
            agentId: agentId
          }, {
            $set: {
              deliveryId: deliveryId,
              status: status
            }
          }));

        case 5:
          res.status(200).json({
            message: 'Agent details updated successfully'
          });
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
});

var Log = require('../model/Log');

router.post('/log', function _callee7(req, res) {
  var _req$body2, agentId, deliveryId, currentLocation, pickupLocation, newLog;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(shippingPublisher(req.body));

        case 3:
          _req$body2 = req.body, agentId = _req$body2.agentId, deliveryId = _req$body2.deliveryId, currentLocation = _req$body2.currentLocation, pickupLocation = _req$body2.pickupLocation;
          newLog = new Log({
            agentId: agentId,
            deliveryId: deliveryId,
            //same as given in Delhivery.js
            currentLocation: {
              stateCapital: currentLocation.stateCapital,
              coordinates: {
                latitude: currentLocation.coordinates.lat,
                longitude: currentLocation.coordinates["long"]
              }
            },
            pickupLocation: {
              location: pickupLocation.location,
              coordinates: {
                latitude: pickupLocation.coordinates.lat,
                longitude: pickupLocation.coordinates["long"]
              }
            }
          });
          _context7.next = 7;
          return regeneratorRuntime.awrap(newLog.save());

        case 7:
          res.status(200).json(newLog);
          _context7.next = 14;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get('/', function (req, res) {
  res.send('Welcome to parcel tracking system');
});
router.get('/shipping/:name', function _callee8(req, res, next) {
  var name;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          name = req.params.name;
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(shippingPublisher(name));

        case 4:
          res.send('shipping');
          _context8.next = 10;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](1);
          next(_context8.t0);

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 7]]);
});
router.get('/onroad/:name', function _callee9(req, res, next) {
  var name;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          name = req.params.name;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(onroadPublisher(name));

        case 4:
          res.send('onroad');
          _context9.next = 10;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](1);
          next(_context9.t0);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 7]]);
});
router.get('/delivered/:name', function _callee10(req, res, next) {
  var name;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          name = req.params.name;
          _context10.prev = 1;
          _context10.next = 4;
          return regeneratorRuntime.awrap(deliveredPublisher(name));

        case 4:
          res.send('delivered');
          _context10.next = 10;
          break;

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10["catch"](1);
          next(_context10.t0);

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[1, 7]]);
});
module.exports = router;