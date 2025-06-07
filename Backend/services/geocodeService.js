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
        console.log(state);
        // chached for 2 weeks
        await redisClient.set(cacheKey , state, { EX: 1209600 }); 
        return state;
    } catch (error) {
        console.log("Nominatim API Error" , error.message);
        throw new Error("Geocoding Failed: Could not determine state");
    }
};

// not really req but will check later 
const normalizeStateName = (state) => {
  if (!state) return null;
  const stateLower = state.toLowerCase();
  const stateMapping = {
    // States (28)
    'andhra pradesh': 'Andhra Pradesh',
    'ap': 'Andhra Pradesh',
    'arunachal pradesh': 'Arunachal Pradesh',
    'assam': 'Assam',
    'bihar': 'Bihar',
    'chhattisgarh': 'Chhattisgarh',
    'cg': 'Chhattisgarh',
    'goa': 'Goa',
    'gujarat': 'Gujarat',
    'haryana': 'Haryana',
    'himachal pradesh': 'Himachal Pradesh',
    'hp': 'Himachal Pradesh',
    'jharkhand': 'Jharkhand',
    'karnataka': 'Karnataka',
    'ka': 'Karnataka',
    'kerala': 'Kerala',
    'kl': 'Kerala',
    'madhya pradesh': 'Madhya Pradesh',
    'mp': 'Madhya Pradesh',
    'maharashtra': 'Maharashtra',
    'bombay': 'Maharashtra',
    'mh': 'Maharashtra',
    'manipur': 'Manipur',
    'meghalaya': 'Meghalaya',
    'mizoram': 'Mizoram',
    'nagaland': 'Nagaland',
    'odisha': 'Odisha',
    'orissa': 'Odisha',
    'punjab': 'Punjab',
    'pb': 'Punjab',
    'rajasthan': 'Rajasthan',
    'rj': 'Rajasthan',
    'sikkim': 'Sikkim',
    'tamil nadu': 'Tamil Nadu',
    'tn': 'Tamil Nadu',
    'telangana': 'Telangana',
    'ts': 'Telangana',
    'tripura': 'Tripura',
    'uttar pradesh': 'Uttar Pradesh',
    'up': 'Uttar Pradesh',
    'uttarakhand': 'Uttarakhand',
    'uk': 'Uttarakhand',
    'west bengal': 'West Bengal',
    'wb': 'West Bengal',
    // Union Territories (8)
    'andaman and nicobar islands': 'Andaman and Nicobar Islands',
    'andaman & nicobar': 'Andaman and Nicobar Islands',
    'chandigarh': 'Chandigarh',
    'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
    'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'daman & diu': 'Dadra and Nagar Haveli and Damanual',
    'delhi': 'Delhi',
    'nct': 'Delhi',
    'national capital territory': 'Delhi',
    'jammu & kashmir': 'Jammu and Kashmir',
    'jammu': 'Jammu and Kashmir',
    'kashmir': 'Jammu and Kashmir',
    'ladakh': 'Ladakh',
    'lakshadweep': 'Lakshadweep',
    'puducherry': 'Puducherry',
    'pondicherry': 'Puducherry'
  };
  return stateMapping[stateLower] || state;
};


//redis failure => console.error
//nominatim failure => throw error