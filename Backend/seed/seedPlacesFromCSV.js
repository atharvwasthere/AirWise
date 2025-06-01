import fs from 'fs';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import Place from '../models/placeModel.js';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// === Seed Function ===
function seedPlaces() {
    const results = [];

    fs.createReadStream('Final_Data.csv')
        .pipe(csvParser())
        .on('data', (data) => {
            try {
                results.push({
                    name: data['Name'],
                    state: data['State'],
                    description: data['Description'],
                    location: JSON.parse(data['Location']),
                    aqiHistory: JSON.parse(data['AQI History']),
                    weather_patterns: JSON.parse(data['Weather Patterns']),
                    bestTimeToVisit: JSON.parse(data['Best Time To Visit']),
                    avgAqi: parseFloat(data['Avg AQI']),
                    tags: data['Tags'].split(','),
                    rank: parseInt(data['Rank']),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            } catch (err) {
                console.error('Error parsing row:', err);
            }
        })
        .on('end', async () => {
            try {
                await Place.deleteMany(); // Optional: clear existing data
                await Place.insertMany(results);
                console.log('Database seeded successfully!');
                mongoose.connection.close();
            } catch (err) {
                console.error('Seeding error:', err);
                mongoose.connection.close();
            }
        });
};

seedPlaces();