// Updated team mapping to match team IDs from the API to jersey filenames for the 2024/25 season
const teamMap = {
    1: 'arsenal',
    2: 'aston-villa',
    3: 'bournemouth',
    4: 'brentford',
    5: 'brighton',
    7: 'chelsea',
    8: 'crystal-palace',
    9: 'everton',
    10: 'fulham',
    11: 'liverpool',
    13: 'man-city',
    14: 'man-utd',
    15: 'newcastle',
    16: 'nottingham-forest',
    17: 'southampton',
    18: 'tottenham',
    19: 'west-ham',
    20: 'wolverhampton',
    21: 'leicester',
    22: 'ipswich',
};

// Fetch and store player data
let playersData = {};

function fetchPlayersData() {
    return fetch('/api/fpl-data')
        .then(response => response.json())
        .then(data => {
            playersData = data.elements.reduce((acc, player) => {
                acc[player.id] = {
                    name: player.web_name,
                    team: teamMap[player.team]
                };
                return acc;
            }, {});
            console.log('Complete playersData object:', playersData);
        })
        .catch(error => console.error('Error fetching player data:', error));
}

// Function to place a player on the football field
function placePlayerOnField(playerId, position) {
    const player = playersData[playerId];
    const playerName = player ? player.name : `Player ID: ${playerId}`;
    const teamName = player ? player.team : 'default';
    const tShirtImageUrl = `team-jerseys/${teamName}.png`;

    const footballField = document.getElementById('football-field');
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-position';
    playerDiv.innerHTML = `
        <img src="${tShirtImageUrl}" alt="${playerName}">
        <p>${playerName}</p>
    `;

    // Map positions to grid positions on the football field
    const positions = {
        1: { top: '80%', left: '45%' }, // GK
        2: { top: '65%', left: '15%' }, // DEF Left
        3: { top: '65%', left: '35%' }, // DEF Center Left
        4: { top: '65%', left: '55%' }, // DEF Center Right
        5: { top: '65%', left: '75%' }, // DEF Right
        6: { top: '45%', left: '15%' }, // MID Left
        7: { top: '45%', left: '35%' }, // MID Center Left
        8: { top: '45%', left: '55%' }, // MID Center Right
        9: { top: '45%', left: '75%' }, // MID Right
        10: { top: '20%', left: '35%' }, // FWD Left
        11: { top: '20%', left: '55%' }, // FWD Right
    };

    playerDiv.style.top = positions[position].top;
    playerDiv.style.left = positions[position].left;

    footballField.appendChild(playerDiv);
}

// Function to place a substitute outside the field
function placeSubstitute(playerId, position, index) {
    const player = playersData[playerId];
    const playerName = player ? player.name : `Player ID: ${playerId}`;
    const teamName = player ? player.team : 'default';
    const tShirtImageUrl = `team-jerseys/${teamName}.png`;

    const footballField = document.getElementById('football-field');
    const subDiv = document.createElement('div');
    subDiv.className = 'substitute';
    subDiv.innerHTML = `
        <img src="${tShirtImageUrl}" alt="${playerName}">
        <p>${playerName}</p>
    `;

    subDiv.style.left = `${index * 100}px`;

    footballField.appendChild(subDiv);
}

// Fetch and display league standings
function fetchAndDisplayStandings() {
    fetch('/api/fpl-standings')
        .then(response => response.json())
        .then(data => {
            const standingsTableBody = document.getElementById('standings-table').querySelector('tbody');
            standingsTableBody.innerHTML = ''; // Clear existing rows

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
            });
        })
        .catch(error => console.error('Error fetching standings:', error));
}

// Populate manager select menu
function populateManagerSelect() {
    fetch('/api/fpl-standings')
        .then(response => response.json())
        .then(data => {
            const playerSelect = document.getElementById('player-select');
            playerSelect.innerHTML = ''; // Clear existing options

            data.standings.results.forEach((team) => {
                const option = document.createElement('option');
                option.value = team.entry; // Use the team ID
                option.text = team.player_name; // Display the manager's name
                playerSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching manager list:', error));
}

// Add event listener to the player picks form
document.getElementById('player-picks-form')?.addEventListener('submit', async function(e) {
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

            const footballField = document.getElementById('football-field');
            footballField.innerHTML = ''; // Clear the field

            if (data.error) {
                footballField.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                console.log('playersData:', playersData); // Log the playersData object

                let subIndex = 0;
                data.picks.forEach((pick, index) => {
                    if (index < 11) {
                        // Start 11 players
                        placePlayerOnField(pick.element, pick.position);
                    } else {
                        // Substitutes
                        placeSubstitute(pick.element, pick.position, subIndex);
                        subIndex++;
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching player picks:', error);
            document.getElementById('football-field').innerHTML = `<p>Error fetching player picks</p>`;
        });
});

// Initialize the page
if (document.getElementById('standings-table')) {
    fetchAndDisplayStandings();
}

if (document.getElementById('player-picks-form')) {
    populateManagerSelect();
    fetchPlayersData();
}
