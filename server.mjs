import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Variable to store the fetched data
let fplData = {};

// Fetch FPL data periodically and store it
async function fetchFPLData() {
    try {
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fplData = await response.json();
        console.log("FPL Data Fetched and stored.");
    } catch (error) {
        console.error('Failed to fetch FPL data:', error);
    }
}

// Route to get FPL data
app.get('/api/fpl-data', (req, res) => {
    if (Object.keys(fplData).length) {
        res.json(fplData);
    } else {
        res.status(503).json({ error: "Data is not available yet, please try again later." });
    }
});

// Call fetchFPLData periodically
setInterval(fetchFPLData, 3600000); // 3600000 milliseconds = 1 hour

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fetchFPLData(); // Also fetch data when the server starts
});




