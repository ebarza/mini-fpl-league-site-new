const express = require('express');
const cors = require('cors');
const path = require('path');
const fplDataRoute = require('./api/fpl-data.cjs');
const fplStandingsRoute = require('./api/fpl-standings.cjs');
const getPlayerPicksRoute = require('./api/get-player-picks.cjs');

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

