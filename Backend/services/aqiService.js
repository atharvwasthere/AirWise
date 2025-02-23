const axios = require("axios");
const redisClient = require("../config/redis");

const fetchAQIData = async (lat, lon) => {
  const cacheKey = `aqi:${lat},${lon}`;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) return JSON.parse(cachedData);

  try {
    const response = await axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WAQI_TOKEN}`
    );
    const aqiData = response.data.data;
    await redisClient.set(cacheKey, JSON.stringify(aqiData), { EX: 3600 }); // Cache for 1h
    return aqiData;
  } catch (error) {
    throw new Error("Failed to fetch AQI data");
  }
};