import express from 'express';
import {getHillStationsByState } from '../controllers/placeController.js';

const router = express.Router();

router.get('/hillStations',getHillStationsByState);

export default router;