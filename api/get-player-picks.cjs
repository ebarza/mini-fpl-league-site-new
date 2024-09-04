const express = require('express');
const axios = require('axios');
const Cors = require('cors');

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
    console.error('Error fetching player picks:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    res.status(500).json({
      message: 'Error fetching player picks',
      error: error.toString(),
      response: error.response ? error.response.data : null,
    });
  }
});

module.exports = router;
