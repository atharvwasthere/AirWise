const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema ({
    _id :ObjectId,
    name :String,
    description : String,
    locatin : {
        type : {type : String , default : 'Point'}, // GeoJSON type
        coordinates : [Number] // [longitude, latitude] format 
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
    avgAqi : Number,
    tags : [String],
    createdAt : {type : Date, default : Date.now},
    updatedAt : {type : Date, default : Date.now}
})

// Geosptial index
placeSchema.index({location : '2dsphere'});

const Place = mongoose.model('Place', placeSchema);

export default Place;