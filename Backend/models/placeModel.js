import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const placeSchema = new Schema ({
    name : {type :String , required: true},
    state : {type:String , required: true},
    description : String,
    location : {
        type : {type : String , default : 'Point' , required: true}, // GeoJSON type
        coordinates: {
            type: [Number],
            required: true
          },        
        state : [String] // State for checking 
    },
    aqiHistory : [
        {
            date : Date,
            aqi : Number,
            pm25 : Number,
            pm10 : Number,
            o3 : Number,
            no2 : Number,
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
    avgAqi : Number,
    tags : [String],
    createdAt : {type : Date, default : Date.now},
    updatedAt : {type : Date, default : Date.now}
})

// Geosptial index
placeSchema.index({location : '2dsphere'});
placeSchema.index({ state: 1 }); // For state-based queries

const Place = mongoose.model('Place', placeSchema);

export default Place;