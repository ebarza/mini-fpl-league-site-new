import express from 'express';
import axios from 'axios';
import Cors from 'cors';

const router = express.Router();
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

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

router.get('/', async (req, res) => {
  await runMiddleware(req, res, cors);

  try {
    console.log('Fetching FPL data...');
    const response = await axios.get('https://fantasy.premierleague.com/api/bootstrap-static/');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching FPL data:', error.message);
    res.status(500).json({
      message: 'Error fetching FPL data',
      error: error.toString(),
      response: error.response ? error.response.data : null, // Log more details if available
    });
  }
});

export default router;
