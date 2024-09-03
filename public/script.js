let playersData = {};

// Fetch and store player data
function fetchPlayersData() {
    fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
        .then(response => response.json())
        .then(data => {
            // Populate the playersData object with player ID as the key and player name as the value
            playersData = data.elements.reduce((acc, player) => {
                acc[player.id] = player.web_name;
                return acc;
            }, {});
            console.log('Players Data:', playersData); // Log the full playersData object
        })
        .catch(error => console.error('Error fetching player data:', error));
}

// Fetch the player data when the page loads
fetchPlayersData();









