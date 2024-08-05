// const redis = require('redis');
// require('dotenv').config();

// const redisClient = redis.createClient({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     password: process.env.REDIS_PASSWORD,
// });
//console.log(redisClient)
require('dotenv').config();
const {createClient} = require('redis')

const redisClient = createClient({
    password: 'PCXpiUifVxnGUsFsHfGqjVdaJklyvywR',
    socket: {
        host: 'redis-12171.c10.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 12171
    }
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.connect();
module.exports = redisClient;