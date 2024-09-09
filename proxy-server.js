const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

app.get('/api/*', (req, res) => {
    const apiUrl = req.url.replace('/api/', '');
    request(
        { url: `https://fantasy.premierleague.com/api/${apiUrl}` },
        (error, response, body) => {
            if (error) {
                res.status(500).send(error);
            } else {
                // Set CORS headers manually (if needed)
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.send(body);
            }
        }
    );
});

const port = 3001;
app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
