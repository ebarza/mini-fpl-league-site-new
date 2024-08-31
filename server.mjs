import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Fetch FPL data and serve it
async function fetchFPLData() {
    try {
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Returns the fetched data
    } catch (error) {
        console.error('Failed to fetch FPL data:', error);
    }
}

// Route to get FPL data
app.get('/api/fpl-data', async (req, res) => {
    const data = await fetchFPLData();
    if (data) {
        res.json(data);
    } else {
        res.status(503).send('Data is not available.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});





