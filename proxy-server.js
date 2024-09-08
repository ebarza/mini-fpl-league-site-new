const express = require('express');
const app = express();
const PORT = 3001; // You can use any available port

app.get('/api/fpl-data', async (req, res) => {
    try {
        const fetch = await import('node-fetch').then(mod => mod.default);
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from FPL API' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
