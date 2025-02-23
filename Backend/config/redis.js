require('dotenv').config();

const redis = require("redis");

const redisClient = redis.createClient({
    url: process.env.REDIS_URI
});

redisClient.connect().then( ()=> console.log("Redis connected"));

module.exports(redisClient);