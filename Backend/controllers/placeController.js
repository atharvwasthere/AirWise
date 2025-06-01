/* 

recieve lat log
get the State on the location
from db fetch location from that states
-
post location details 

*/

import Place from "../models/placeModel.js"
import { fetchAQIData, getIndianLocationDetails } from "../services/index.js";


// Get hill stations in the user's state
const getHillStationsByState = async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const state = await getIndianLocationDetails(lat, lon);
    const hillStations = await Place.find({ state, description: { $regex : /hill station/i} }); // case insesnsitve search
    res.json(hillStations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get AQI history for a hill station
const getAQIHistory = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    res.json(place.aqiHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {getAQIHistory, getHillStationsByState};
