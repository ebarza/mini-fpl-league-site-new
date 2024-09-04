
import express from 'express';
import axios from 'axios';
import Cors from 'cors';

// Initialize router
const router = express.Router();

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
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

// The route handler for fetching FPL player data
router.get('/', async (req, res) => {
  await runMiddleware(req, res, cors);

  try {
    const response = await axios.get('https://fantasy.premierleague.com/api/bootstrap-static/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FPL player data' });
  }
});

export default router;

