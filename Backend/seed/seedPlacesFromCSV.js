import fs from 'fs';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import Place from '../models/placeModel.js';
import dotenv from 'dotenv';
dotenv.config();

async function seedPlaces() {
    try {
        const uri = process.env.MONGODB_URI_WSL;
        console.log("Mongo URI:", uri);
        if (!uri) throw new Error("MONGODB_URI_WSL is undefined");

        await mongoose.connect(uri, {
            maxPoolSize: 10,
        });
        console.log("MongoDB connected, starting seed...");

        const results = [];

        // Return a promise that resolves on CSV end
        await new Promise((resolve, reject) => {
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
                .on('end', () => resolve())
                .on('error', (err) => reject(err));
        });
        
        const insertResult = await Place.insertMany(results);
        console.log('Inserted:', insertResult.length);


        await Place.deleteMany(); // Optional: clear existing data
        await Place.insertMany(results);
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

seedPlaces();
