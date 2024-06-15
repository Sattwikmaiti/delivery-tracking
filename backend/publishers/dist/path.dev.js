"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs').promises;

function readJsonFile(filePath) {
  var data;
  return regeneratorRuntime.async(function readJsonFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fs.readFile(filePath, 'utf-8'));

        case 3:
          data = _context.sent;
          return _context.abrupt("return", JSON.parse(data));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Error reading or parsing ".concat(filePath, ":"), _context.t0);
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

var PriorityQueue =
/*#__PURE__*/
function () {
  function PriorityQueue() {
    _classCallCheck(this, PriorityQueue);

    this.queue = [];
  }

  _createClass(PriorityQueue, [{
    key: "enqueue",
    value: function enqueue(element, priority) {
      var queueElement = {
        element: element,
        priority: priority
      };
      var added = false;

      for (var i = 0; i < this.queue.length; i++) {
        if (this.queue[i].priority > queueElement.priority) {
          this.queue.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }

      if (!added) {
        this.queue.push(queueElement);
      }
    }
  }, {
    key: "dequeue",
    value: function dequeue() {
      return this.queue.shift();
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.queue.length === 0;
    }
  }]);

  return PriorityQueue;
}();

function dijkstra(graph, startNode) {
  var distances = {};
  var predecessors = {};
  var visited = new Set();
  var queue = new PriorityQueue();

  for (var node in graph) {
    distances[node] = Infinity;
    predecessors[node] = null;
  }

  distances[startNode] = 0;
  queue.enqueue(startNode, 0);

  var _loop = function _loop() {
    var _queue$dequeue = queue.dequeue(),
        currentNode = _queue$dequeue.element;

    visited.add(currentNode);
    graph[currentNode].forEach(function (neighbor) {
      if (!visited.has(neighbor.city)) {
        var newDistance = distances[currentNode] + neighbor.weight;

        if (newDistance < distances[neighbor.city]) {
          distances[neighbor.city] = newDistance;
          predecessors[neighbor.city] = currentNode;
          queue.enqueue(neighbor.city, newDistance);
        }
      }
    });
  };

  while (!queue.isEmpty()) {
    _loop();
  }

  return {
    distances: distances,
    predecessors: predecessors
  };
}

function getPath(startNode, endNode, predecessors) {
  var path = [endNode];
  var current = endNode;

  while (current !== startNode) {
    current = predecessors[current];
    path.unshift(current);
  }

  return path;
}

var path = function path(source, destination) {
  var graphData, cities, graph, mapping, _dijkstra, distances, predecessors, path, coordinates;

  return regeneratorRuntime.async(function path$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(source, destination);
          _context2.next = 3;
          return regeneratorRuntime.awrap(readJsonFile('graphData.json'));

        case 3:
          graphData = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(readJsonFile('location.json'));

        case 6:
          cities = _context2.sent;
          graph = graphData.graph;
          mapping = {};
          cities.forEach(function (city) {
            mapping[city.city] = {
              lat: city.lat,
              "long": city.lng
            };
          });
          _dijkstra = dijkstra(graph, source), distances = _dijkstra.distances, predecessors = _dijkstra.predecessors;
          path = getPath(source, destination, predecessors);
          coordinates = path.map(function (city) {
            return {
              city: city,
              lat: mapping[city].lat,
              lng: mapping[city]["long"] // corrected from "lng" to "long"

            };
          });
          return _context2.abrupt("return", coordinates);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = path;