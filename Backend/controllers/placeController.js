        /* 

        recieve lat log
        get the State on the location
        from db fetch location from that states
        -
        post location details 

        */  

        const Place = require("../models/placeModel");
        const { getStateFromCoordinates } = require("../utils/geocodeUtils");
        const { fetchAQIData } = require("../services/aqiService");
        
        // Get hill stations in the user's state
        const getHillStationsByState = async (req, res) => {
          const { lat, lon } = req.query;
          try {
            const state = await getStateFromCoordinates(lat, lon);
            const hillStations = await Place.find({ state });
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