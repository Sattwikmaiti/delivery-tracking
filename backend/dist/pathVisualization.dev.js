"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Fetch the preprocessed graph data pickuplocation = Lucknow , current=Mumbai
// import fs from 'fs'
var fs = require('fs');

var fetch = require('node-fetch');

var source = "Mumbai";
var destination = "Kolkata";
fetch("graphData.json").then(function (response) {
  return response.json();
}).then(function (data) {
  var graph = data.graph;
  var cityIndex = data.cityIndex; // Read the JSON file (this is now embedded)

  var mapping = {};
  fetch("location.json").then(function (response) {
    return response.json();
  }).then(function (cities) {
    cities.forEach(function (city) {
      mapping[city.city] = {
        lat: city.lat,
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


    var _dijkstra = dijkstra(graph, source),
        distances = _dijkstra.distances,
        predecessors = _dijkstra.predecessors; // Display the shortest path


    var path = getPath(source, destination, predecessors);
    var coordinates = path.map(function (city) {
      return [mapping[city].lat, mapping[city]["long"]];
    }); // Write the coordinates to a file

    fs.writeFile('coordinates.json', JSON.stringify(coordinates, null, 2), function (err) {
      if (err) {
        console.error('Error writing coordinates to file:', err);
      } else {
        console.log('Coordinates saved to coordinates.json');
      }
    }); // No need for map initialization and plotting since it's not used in this script
  });
}); // const fs = require('fs'); // Import the fs module for file operations
// const val = true;
// if (val) {
//   const source = "Mumbai";
//   const destination = "Lucknow";
//   fetch("graphData.json")
//     .then((response) => response.json())
//     .then((data) => {
//       const graph = data.graph;
//       const cityIndex = data.cityIndex;
//       // Read the JSON file (this is now embedded)
//       const mapping = {};
//       fetch("location.json")
//         .then((response) => response.json())
//         .then((cities) => {
//           cities.forEach((city) => {
//             mapping[city.city] = {
//               lat: city.lat,
//               long: city.lng,
//             };
//           });
//           class PriorityQueue {
//             constructor() {
//               this.queue = [];
//             }
//             enqueue(element, priority) {
//               const queueElement = { element, priority };
//               let added = false;
//               for (let i = 0; i < this.queue.length; i++) {
//                 if (this.queue[i].priority > queueElement.priority) {
//                   this.queue.splice(i, 0, queueElement);
//                   added = true;
//                   break;
//                 }
//               }
//               if (!added) {
//                 this.queue.push(queueElement);
//               }
//             }
//             dequeue() {
//               return this.queue.shift();
//             }
//             isEmpty() {
//               return this.queue.length === 0;
//             }
//           }
//           function dijkstra(graph, startNode) {
//             const distances = {};
//             const predecessors = {}; // Keep track of predecessors for each node
//             const visited = new Set();
//             const queue = new PriorityQueue();
//             // Initialize distances and predecessors
//             for (const node in graph) {
//               distances[node] = Infinity;
//               predecessors[node] = null;
//             }
//             distances[startNode] = 0;
//             queue.enqueue(startNode, 0);
//             while (!queue.isEmpty()) {
//               const { element: currentNode } = queue.dequeue();
//               visited.add(currentNode);
//               graph[currentNode].forEach((neighbor) => {
//                 if (!visited.has(neighbor.city)) {
//                   const newDistance = distances[currentNode] + neighbor.weight;
//                   if (newDistance < distances[neighbor.city]) {
//                     distances[neighbor.city] = newDistance;
//                     predecessors[neighbor.city] = currentNode; // Update predecessor
//                     queue.enqueue(neighbor.city, newDistance);
//                   }
//                 }
//               });
//             }
//             return { distances, predecessors };
//           }
//           function getPath(startNode, endNode, predecessors) {
//             const path = [endNode];
//             let current = endNode;
//             while (current !== startNode) {
//               current = predecessors[current];
//               path.unshift(current);
//             }
//             return path;
//           }
//           // Example usage
//           const { distances, predecessors } = dijkstra(graph, source);
//           const path = getPath(source, destination, predecessors);
//           // Convert the path to an array of coordinates
//           const coordinates = path.map(city => [mapping[city].lat, mapping[city].long]);
//           // Write the coordinates to a file
//           fs.writeFile('pathCoordinates.json', JSON.stringify(coordinates, null, 2), (err) => {
//             if (err) {
//               console.error('Error writing to file', err);
//             } else {
//               console.log('Path coordinates saved to pathCoordinates.json');
//             }
//           });
//         });
//     });
// }