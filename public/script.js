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
                // Populate standings table
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${team.entry_name}</td>
                    <td>${team.player_name}</td>
                    <td>${team.event_total}</td>
                    <td>${team.total}</td>
                `;
                standingsTableBody.appendChild(row);

                // Populate player select menu
                const option = document.createElement('option');
                option.value = team.entry; // Use the team ID
                option.text = team.player_name; // Display the manager's name
                playerSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching standings:', error));
}

// Add event listener to the player picks form
document.getElementById('player-picks-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const teamId = document.getElementById('player-select').value;
    const gameweek = document.getElementById('gameweek-select').value;

    fetch(`/api/get-player-picks?teamId=${teamId}&gameweek=${gameweek}`)
        .then(response => response.json())
        .then(data => {
            const picksResult = document.getElementById('picks-result');
            picksResult.innerHTML = '';

            if (data.error) {
                picksResult.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                data.picks.forEach(pick => {
                    const playerName = playersData[pick.element] || `Player ID: ${pick.element}`;
                    picksResult.innerHTML += `<p>${playerName} - Position: ${pick.position}</p>`;
                });
            }
        })
        .catch(error => console.error('Error fetching player picks:', error));
});

// Initialize the page by fetching and displaying the standings
fetchAndDisplayStandings();

// Fetch the player data when the page loads
fetchPlayersData();








