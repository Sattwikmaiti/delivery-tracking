const fs = require('fs');

// Load the graph data
const graphData = JSON.parse(fs.readFileSync('graphData.json'));
const graph = graphData.graph;

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
const data = fs.readFileSync('location.json');
const cities = JSON.parse(data);

// Initialize the graph
const mapping = {};

// Initialize the graph with nodes
cities.forEach(city => {
    mapping[city.city] = {
        "lat":city.lat,
        "long":city.lng
    };
});

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
    const predecessors = {}; // Keep track of predecessors for each node
    const visited = new Set();
    const queue = new PriorityQueue();

    // Initialize distances and predecessors
    for (const node in graph) {
        distances[node] = Infinity;
        predecessors[node] = null;
    }
    distances[startNode] = 0;

    queue.enqueue(startNode, 0);

    while (!queue.isEmpty()) {
        const { element: currentNode } = queue.dequeue();
        visited.add(currentNode);

        graph[currentNode].forEach(neighbor => {
            if (!visited.has(neighbor.city)) {
                const newDistance = distances[currentNode] + neighbor.weight;
                if (newDistance < distances[neighbor.city]) {
                    distances[neighbor.city] = newDistance;
                    predecessors[neighbor.city] = currentNode; // Update predecessor
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

// Example usage
const source = "Delhi";
const destination = "Bangalore";
const { distances, predecessors } = dijkstra(graph, source);

// Display the shortest path
const path = getPath(source, destination, predecessors);


path.map((city,index)=>
{

    
    console.log(`City ${index+1} : `,city," latitude : ",mapping[city].lat,"longitude : ",mapping[city].long)

})