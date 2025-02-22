const express = require("express");
const connectDB = require("./config/db");
// const placeRoutes = require("./routes/placeRoutes");
require('dotenv').config();

const app = express();

app.use(express.json());

// app.use("/api/places", placeRoutes);


// DB connection

connectDB();

module.exports = app;

