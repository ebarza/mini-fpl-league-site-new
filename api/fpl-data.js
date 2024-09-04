
const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Fetching FPL data...');
    const response = await axios.get('https://fantasy.premierleague.com/api/bootstrap-static/');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching FPL data:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    res.status(500).json({
      message: 'Error fetching FPL data',
      error: error.toString(),
      response: error.response ? error.response.data : null,
    });
  }
};




