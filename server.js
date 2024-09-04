import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fplDataRoute from './api/fpl-data.js';
import fplStandingsRoute from './api/fpl-standings.js';
import getPlayerPicksRoute from './api/get-player-picks.js';

// Create __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use your API routes
app.use('/api/fpl-data', fplDataRoute);
app.use('/api/fpl-standings', fplStandingsRoute);
app.use('/api/get-player-picks', getPlayerPicksRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
