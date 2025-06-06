import mongoose from 'mongoose';
import xlsx from 'xlsx';
import  StateFallback from '../models/statefallbackModel.js'; 
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

async function seedFallbacks() {
  const workbook = xlsx.readFile('fallbacks_with_tags.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  for (const row of data) {
    const newFallback = new StateFallback({
      state: row.state,
      description: row.description,
      fallback_states: row.fallback_states.split(','),
      to_visit: JSON.parse(row.to_visit)
    });

    try {
      await newFallback.save();
      console.log(`Inserted: ${row.state}`);
    } catch (err) {
      console.error(`Error inserting ${row.state}:`, err.message);
    }
  }

  mongoose.disconnect();
  console.log('Seeding completed.');
}

seedFallbacks();