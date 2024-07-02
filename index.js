require('dotenv').config();
const { createClient } = require('redis');

let redisConnected = false;

const redisUrl = process.env.REDIS_URL;
console.log('REDIS_URL:', redisUrl);

if (!redisUrl) {
  console.error('REDIS_URL is not defined. Please check your .env file.');
  process.exit(1);
}

const redisClient = createClient({
  url: redisUrl
});

redisClient.on('ready', () => {
  console.log('Connected to AWS ElastiCache Redis');
  redisConnected = true;
  checkConnections();
});

redisClient.on('error', (err) => {
  console.error('Error connecting to AWS ElastiCache Redis:', err);
  redisConnected = false;
  checkConnections();
});

redisClient.connect()
  .then(() => {
    console.log('Redis client connection initiated');
  })
  .catch((err) => {
    console.error('Error initiating Redis client connection:', err);
    redisConnected = false;
    checkConnections();
  });

function checkConnections() {
  console.log('Checking Redis connection status...');
  if (redisConnected) {
    console.log('Redis is connected');
  } else {
    console.log('Redis is not connected');
  }
}

console.log('Script is running and attempting to connect to Redis...');
