import axios from 'axios';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error if it takes too long
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// The main function to fetch FPL standings
export default async function handler(req, res) {
  // Run CORS
  await runMiddleware(req, res, cors);

  try {
    const leagueId = '352180';
    const response = await axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FPL data' });
  }
}



