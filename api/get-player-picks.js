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

  const { teamId, gameweek } = req.query;

  if (!teamId || !gameweek) {
    return res.status(400).json({ error: 'Team ID and gameweek are required' });
  }

  try {
    const response = await axios.get(
      `https://fantasy.premierleague.com/api/entry/${teamId}/event/${gameweek}/picks/`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching player picks' });
  }
});

export default router;


