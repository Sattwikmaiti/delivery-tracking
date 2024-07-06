"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs'); // Load the graph data


var graphData = JSON.parse(fs.readFileSync('graphData.json'));
var graph = graphData.graph;
/*
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}
Direct Distance between two points on earth is always the shortest.

*/
// Read the JSON file

var data = fs.readFileSync('location.json');
var cities = JSON.parse(data); // Initialize the graph

var mapping = {}; // Initialize the graph with nodes

cities.forEach(function (city) {
  mapping[city.city] = {
    "lat": city.lat,
    "long": city.lng
  };
});

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
  var predecessors = {}; // Keep track of predecessors for each node

  var visited = new Set();
  var queue = new PriorityQueue(); // Initialize distances and predecessors

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
          predecessors[neighbor.city] = currentNode; // Update predecessor

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
} // Example usage


var source = "Delhi";
var destination = "Mumbai";

var _dijkstra = dijkstra(graph, source),
    distances = _dijkstra.distances,
    predecessors = _dijkstra.predecessors; // Display the shortest path


var path = getPath(source, destination, predecessors);
path.map(function (city, index) {
  console.log("City ".concat(index + 1, " : "), city, " latitude : ", mapping[city].lat, "longitude : ", mapping[city]["long"]);
});