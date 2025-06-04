import dotenv from 'dotenv';
dotenv.config();
import redis from 'redis';

const redisClient = redis.createClient({url: process.env.REDIS_URI});

redisClient.connect().then( ()=> console.log("Redis connected"));
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});


export default redisClient;
