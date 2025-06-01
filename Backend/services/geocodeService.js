import  axios  from "axios";
import redisClient from "../config/redis.js"

// geting  States from user's current corrdinates

export const getIndianLocationDetails  = async (lat, lon) => {
    const cacheKey = `geocode: ${lat},${lon}`;
    try {
    const cachedState = await redisClient.get(cacheKey);
    if (cachedState) return JSON.parse(cachedState);
    } catch(error) {
        console.error("Error getting AQI data from cache",error.message);
        // If there's an error with Redis, proceed to fetch from the API

    }
    // Fetch from nominatim
    try{
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse" , {
            params: { lat, lon, format: "json" , addressdetails: 1, country: "India"},
        });
        const state = normalizeStateName(response.data.address.state);

        // chached for 2 weeks
        await redisClient.set(cacheKey , state, { EX: 1209600 }); 
        return state;
    } catch (error) {
        console.log("Nominatim API Error" , error.message);
        throw new Error("Geocoding Failed: Could not determine state");
    }
};

// not really req but will check later 
const normalizeStateName = (State) =>{
    const stateMapping = { 
        'Delhi': 'National Capital Territory of Delhi',
        'Bombay': 'Maharashtra',
        // Add more mappings as needed
    };
    return stateMapping(State) || State;
}


//redis failure => console.error
//nominatim failure => throw error