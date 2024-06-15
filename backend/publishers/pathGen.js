const path = require('./path.js');

const [,, source, destination] = process.argv;

if (!source || !destination) {
  console.error('Please provide source and destination cities.');
  process.exit(1);
}

path(source, destination)
  .then((result) => {
    console.log('Shortest path:', result);
  })
  .catch((error) => {
    console.error('Error finding path:', error);
  });
