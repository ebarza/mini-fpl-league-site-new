import express from 'express';
import axios from 'axios';
import cors from 'cors';

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// Define the API route to fetch FPL standings
app.get('/api/fpl-standings', async (req, res) => {
  try {
    const leagueId = '352180';
    const response = await axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching FPL data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


