import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const LEAGUE_ID = '352180'; // Your league ID

app.use(express.static('public'));

// Variable to store the fetched league data
let leagueData = {};

// Function to fetch league data
async function fetchLeagueData() {
    const url = `https://fantasy.premierleague.com/api/leagues-classic/${LEAGUE_ID}/standings/`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch league data: ${response.status}`);
        }
        const data = await response.json();
        leagueData = data; // Store the data in the variable
        console.log("League data updated successfully.");
    } catch (error) {
        console.error('Error fetching league data:', error);
    }
}

// API endpoint to get league data
app.get('/api/league', (req, res) => {
    if (Object.keys(leagueData).length) {
        res.json(leagueData);
    } else {
        res.status(503).send('League data not available yet. Please check back later.');
    }
});

// Fetch league data on a schedule - every hour
setInterval(fetchLeagueData, 3600000); // 3600000 ms = 1 hour

// Fetch league data when the server starts
fetchLeagueData();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

