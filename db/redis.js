const redis = require('redis');

let client;

client = redis.createClient({
  host: 'redis',
  port: process.env.REDIS_PORT,
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = client;
