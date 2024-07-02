require('dotenv').config();
const { createClient } = require('redis');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const { Hono } = require('hono');

const redisUrl = process.env.REDIS_URL;
const mongoUrl = process.env.MONGO_URL;

let redisConnected = false;
let mongoConnected = false;

const app = new Hono();

if (redisUrl) {
  const redisClient = createClient({ url: redisUrl });

  redisClient.on('ready', () => {
    redisConnected = true;
    console.log('Connected to AWS ElastiCache Redis');
    checkConnections();
  });

  redisClient.on('error', (err) => {
    redisConnected = false;
    console.error('Error connecting to AWS ElastiCache Redis:', err);
    checkConnections();
  });

  redisClient.connect()
    .then(() => {
      console.log('Redis client connection initiated');
    })
    .catch((err) => {
      redisConnected = false;
      console.error('Error initiating Redis client connection:', err);
      checkConnections();
    });

  console.log('Attempting to connect to Redis...');
} else {
  console.log('REDIS_URL is not defined. Redis will not be started.');
}

if (mongoUrl) {
  const ca = [fs.readFileSync('global-bundle.pem')];
  const mongoClient = new MongoClient(mongoUrl, {
    tls: true,
    tlsCAFile: 'global-bundle.pem'
  });

  mongoClient.connect()
    .then(() => {
      mongoConnected = true;
      console.log('Connected to Amazon DocumentDB');
      return mongoClient.db().admin().ping();
    })
    .then(() => {
      console.log('Successfully pinged Amazon DocumentDB');
      checkConnections();
    })
    .catch((err) => {
      mongoConnected = false;
      console.error('Error connecting to Amazon DocumentDB:', err);
      checkConnections();
    });

  console.log('Attempting to connect to MongoDB...');
} else {
  console.log('MONGO_URL is not defined. MongoDB will not be started.');
}

function checkConnections() {
  if (redisConnected && mongoConnected) {
    console.log('Both Redis and MongoDB are connected');
  } else if (redisConnected) {
    console.log('Redis is connected, MongoDB is not connected');
  } else if (mongoConnected) {
    console.log('MongoDB is connected, Redis is not connected');
  } else {
    console.log('Neither Redis nor MongoDB are connected');
  }
}

app.get('/api/check-connections', (c) => {
  if (redisConnected && mongoConnected) {
    return c.json({ status: 'Both Redis and MongoDB are connected' });
  } else if (redisConnected) {
    return c.json({ status: 'Redis is connected, MongoDB is not connected' });
  } else if (mongoConnected) {
    return c.json({ status: 'MongoDB is connected, Redis is not connected' });
  } else {
    return c.json({ status: 'Neither Redis nor MongoDB are connected' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
