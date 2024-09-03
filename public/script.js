let playersData = {};

// Fetch and store player data
function fetchPlayersData() {
    return fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
        .then(response => response.json())
        .then(data => {
            playersData = data.elements.reduce((acc, player) => {
                acc[player.id] = player.web_name;
                return acc;
            }, {});
            console.log('Complete playersData object:', playersData); // Log the complete object
        })
        .catch(error => console.error('Error fetching player data:', error));
}

// Fetch and display league standings, and populate the manager select menu
function fetchAndDisplayStandings() {
    fetch('/api/fpl-standings')
        .then(response => response.json())
        .then(data => {
            const standingsTableBody = document.getElementById('standings-table').querySelector('tbody');
            const playerSelect = document.getElementById('player-select');
            standingsTableBody.innerHTML = ''; // Clear existing rows
            playerSelect.innerHTML = ''; // Clear existing options

            data.standings.results.forEach((team, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${team.entry_name}</td>
                    <td>${team.player_name}</td>
                    <td>${team.event_total}</td>
                    <td>${team.total}</td>
                `;
                standingsTableBody.appendChild(row);

                const option = document.createElement('option');
                option.value = team.entry; // Use the team ID
                option.text = team.player_name; // Display the manager's name
                playerSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching standings:', error));
}

// Add event listener to the player picks form
document.getElementById('player-picks-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const teamId = document.getElementById('player-select').value;
    const gameweek = document.getElementById('gameweek-select').value;

    console.log(`Fetching picks for Team ID: ${teamId}, Gameweek: ${gameweek}`);

    // Ensure playersData is fully loaded before using it
    if (!Object.keys(playersData).length) {
        await fetchPlayersData(); // Fetch if not loaded
    }

    fetch(`/api/get-player-picks?teamId=${teamId}&gameweek=${gameweek}`)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // Log the full response

            const picksResult = document.getElementById('picks-result');
            picksResult.innerHTML = '';

            if (data.error) {
                picksResult.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                console.log('playersData:', playersData); // Log the playersData object

                data.picks.forEach(pick => {
                    // Retrieve player name using player ID
                    const playerName = playersData[pick.element];
                    console.log(`Attempting to map Player ID: ${pick.element}, Found Name: ${playerName}`);
                    picksResult.innerHTML += `<p>${playerName ? playerName : `Player ID: ${pick.element}`} - Position: ${pick.position}</p>`;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching player picks:', error);
            document.getElementById('picks-result').innerHTML = `<p>Error fetching player picks</p>`;
        });
});

// Initialize the page by fetching and displaying the standings
fetchAndDisplayStandings();

// Fetch the player data when the page loads
fetchPlayersData();
















