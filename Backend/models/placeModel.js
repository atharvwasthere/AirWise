import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    name: { type: String, required: false },
    state: { type: String, required: true },
    description: String,
    location: {
        type: { type: String, default: 'Point' }, // GeoJSON type, not required
        coordinates: { type: [Number] }, // Optional coordinates
        state: [String], // State for checking
        fallback_state: [String] // Fallback states for states without hill stations
    },
    aqiHistory: [
        {
            date: Date,
            aqi: Number,
        }
    ],
    weather_patterns: {
        summer: String,
        monsoon: String,
        winter: String
    },
    bestTimeToVisit: {
        from: String,
        to: String
    },
    avgAqi: Number,
    tags: [String],
    isFallback: Boolean,
    rank: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Geospatial index
placeSchema.index({ location: '2dsphere' });
placeSchema.index({ state: 1 }); // For state-based queries

const Place = mongoose.model('Place', placeSchema);

export default Place;