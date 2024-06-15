const fs = require('fs').promises;

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading or parsing ${filePath}:`, error);
    throw error;
  }
}

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.queue.length; i++) {
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

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

function dijkstra(graph, startNode) {
  const distances = {};
  const predecessors = {};
  const visited = new Set();
  const queue = new PriorityQueue();

  for (const node in graph) {
    distances[node] = Infinity;
    predecessors[node] = null;
  }
  distances[startNode] = 0;

  queue.enqueue(startNode, 0);

  while (!queue.isEmpty()) {
    const { element: currentNode } = queue.dequeue();
    visited.add(currentNode);

    graph[currentNode].forEach((neighbor) => {
      if (!visited.has(neighbor.city)) {
        const newDistance = distances[currentNode] + neighbor.weight;
        if (newDistance < distances[neighbor.city]) {
          distances[neighbor.city] = newDistance;
          predecessors[neighbor.city] = currentNode;
          queue.enqueue(neighbor.city, newDistance);
        }
      }
    });
  }

  return { distances, predecessors };
}

function getPath(startNode, endNode, predecessors) {
  const path = [endNode];
  let current = endNode;
  while (current !== startNode) {
    current = predecessors[current];
    path.unshift(current);
  }
  return path;
}

const path = async (source, destination) => {
    console.log(source,destination)
  const graphData = await readJsonFile('graphData.json');
  const cities = await readJsonFile('location.json');

  const graph = graphData.graph;
  const mapping = {};
  cities.forEach((city) => {
    mapping[city.city] = {
      lat: city.lat,
      long: city.lng,
    };
  });

  const { distances, predecessors } = dijkstra(graph, source);
  const path = getPath(source, destination, predecessors);
  const coordinates = path.map(city => ({
    city,
    lat: mapping[city].lat,
    lng: mapping[city].long // corrected from "lng" to "long"
  }));
  return coordinates;
};

module.exports = path;
