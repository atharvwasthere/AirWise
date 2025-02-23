const axios = require("axios");
const redisClient = require("../config/redis");

// geting  States from user's current corrdinates

const getStateFromCoordinates = async (lat, lon) => {
    const cacheKey = `geocode: ${lat},${lon}`;
    const cachedState = await redisClient.get(cacheKey);
    if (cachedState) return cachedState;

    try{
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse" , {
            params: { lat, lon, format: "json" , addressdetails: 1, country: "India"},
        });
        const state = response.data.address.state;
        // chached for 2 weeks
        await redisClient.set(chacheKey , state, { EX: 1209600 }); 
        return state;
    } catch (error) {
        throw new Error("Geocoding Failed could not determine state");
    }
};

module.exports = getStateFromCoordinates;