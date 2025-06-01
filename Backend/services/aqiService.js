import  Axios  from "axios";
import redisClient from "../config/redis.js"

export const fetchAQIData = async (lat, lon) => {
  const cacheKey = `aqi:${lat},${lon}`;
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

  } catch (error) {
    console.error("Error getting AQI data from cache",error.message);
    // If there's an error with Redis, proceed to fetch from the API

  }
  // Now fetching from WAQI
  try {
    const response = await Axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WAQI_TOKEN}`
    );
    const aqiData = response.data.data;
    await redisClient.set(cacheKey, JSON.stringify(aqiData), { EX: 3600 }); // Cache for 1h
    return aqiData;
  } catch (error) {
    console.error("Failed to fetch AQI data",error.message);
    return{aqi: null , message: "Failed to fetch AQI data from WAQI"}
  }
};

