import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import placeRoutes from './routes/hillstationsRoutes.js'
// const placeRoutes = require("./routes/placeRoutes");
dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/places", placeRoutes);


// DB connection

connectDB();

export default app;
