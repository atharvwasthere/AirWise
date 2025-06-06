/* 

recieve lat log
get the State on the location
from db fetch location from that states
-
post location details 

*/
import Place from "../models/placeModel.js";
import StateFallback from "../models/stateFallbackModel.js"; // Import StateFallback model
import { fetchAQIData, getIndianLocationDetails } from "../services/index.js";

// Get hill stations in the user's state or fallback states
const getHillStationsByState = async (req, res) => {
  const { lat, lon } = req.query;

  // Validate latitude and longitude
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ message: "Valid latitude and longitude are required" });
  }

  try {
    // Get the user's state from coordinates
    const state = await getIndianLocationDetails(lat, lon);
    if (!state) {
      return res.status(400).json({ message: "Could not determine state from coordinates" });
    }

    // Fetch hill stations in the user's state
    const hillStations = await Place.find({
      state,
      description: { $regex: /hill station/i } 
    });

    if (hillStations.length > 0) {
      // Return hill stations if found
      return res.status(200).json({
        message: `Found ${hillStations.length} hill station(s) in ${state}`,
        results: hillStations
      });
    }

    // No hill stations found, check fallback states
    const fallback = await StateFallback.findOne({ state });
    if (fallback && fallback.fallback_states.length > 0) {
      // Fetch hill stations from fallback states
      const fallbackHillStations = await Place.find({
        state: { $in: fallback.fallback_states },
        description: { $regex: /hill station/i }
      });

      if (fallbackHillStations.length > 0) {
        return res.status(200).json({
          message: `No hill stations in ${state}, showing ${fallbackHillStations.length} option(s) in ${fallback.fallback_states.join(', ')}`,
          results: fallbackHillStations,
          alternatives: fallback.to_visit || [] 
        });
      }

      // No hill stations in fallback states (unlikely)
      return res.status(200).json({
        message: `No hill stations found in ${state} or nearby states (${fallback.fallback_states.join(', ')})`,
        results: [],
        alternatives: fallback.to_visit || [] // Suggest alternatives
      });
    }

    // No fallback states defined
    return res.status(200).json({
      message: `No hill stations or fallback states found for ${state}`,
      results: [],
      alternatives: []
    });
  } catch (error) {
    console.error('Error in getHillStationsByState:', error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Get AQI history for a hill station
const getAQIHistory = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Hill station not found" });
    }
    res.status(200).json(place.aqiHistory);
  } catch (error) {
    console.error('Error in getAQIHistory:', error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export { getAQIHistory, getHillStationsByState };