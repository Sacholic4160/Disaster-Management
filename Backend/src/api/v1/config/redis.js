require('dotenv').config();
const Redis = require('ioredis');

const redisClient = new Redis({
    port: 12171, // Redis port
    host: 'redis-12171.c10.us-east-1-2.ec2.redns.redis-cloud.com', // Redis host
    password: 'PCXpiUifVxnGUsFsHfGqjVdaJklyvywR',
    db: 0, // Database index to use
   // tls: {} // Enable TLS if required by your Redis instance
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

module.exports = redisClient;
