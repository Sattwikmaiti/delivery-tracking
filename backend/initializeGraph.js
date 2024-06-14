const fs = require('fs');

// Read the JSON file
const data = fs.readFileSync('location.json');
const cities = JSON.parse(data);

// Initialize the graph
const graph = {};

// Initialize the graph with nodes
cities.forEach(city => {
    graph[city.city] = [];
});

// Create a city-to-index map for adjacency matrix
const cityIndex = {};
cities.forEach((city, index) => {
    cityIndex[city.city] = index;
});

// Initialize the adjacency matrix with Infinity
const n = cities.length;
const adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(Infinity));

// Calculate distances and create edges
for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
        const city1 = cities[i];
        const city2 = cities[j];

        const distance = Math.floor(Math.random() * 1000) + 1;
        graph[city1.city].push({ city: city2.city, weight: distance });
        graph[city2.city].push({ city: city1.city, weight: distance });

        // Fill the adjacency matrix
        const index1 = cityIndex[city1.city];
        const index2 = cityIndex[city2.city];
        adjacencyMatrix[index1][index2] = distance;
        adjacencyMatrix[index2][index1] = distance;
    }
}

// Set diagonal to 0 (distance from a city to itself)
for (let i = 0; i < n; i++) {
    adjacencyMatrix[i][i] = 0;
}
adjacencyMatrix.forEach(row => {
    console.log(row.join(' '));
});


// Save the graph and adjacency matrix to a JSON file
const outputData = {
    graph,
    adjacencyMatrix,
    cityIndex,
};
fs.writeFileSync('graphData.json', JSON.stringify(outputData, null, 2));

console.log("Graph and adjacency matrix initialized and saved to graphData.json");
