import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Fetch and log FPL data periodically
async function fetchFPLData() {
    try {
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("FPL Data Fetched:", data);
        // You might want to process the data or store it here
    } catch (error) {
        console.error('Failed to fetch FPL data:', error);
    }
}

// Call fetchFPLData periodically
setInterval(fetchFPLData, 3600000); // 3600000 milliseconds = 1 hour

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    fetchFPLData(); // Also fetch data when the server starts
});



