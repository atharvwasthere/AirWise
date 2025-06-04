import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const stateFallbackSchema = new Schema({
  state: { type: String, required: true, unique: true },
  fallback_states: [String],
  description: String,
  to_visit: [String]
});

const StateFallback = mongoose.model('StateFallback', stateFallbackSchema);
export default StateFallback;