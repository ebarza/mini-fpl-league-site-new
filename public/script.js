let playersData = {};

function fetchPlayersData(gameweek) {
    return fetch(`/api/fpl-data?gameweek=${gameweek}`)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Log the fetched data for verification
            playersData = data.elements.reduce((acc, player) => {
                acc[player.id] = {
                    name: player.web_name,
                    photo: `https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`,
                    points: player.event_points || 0 // Use event points for the selected gameweek
                };
                return acc;
            }, {});
            console.log('Processed playersData object for GW', gameweek, playersData);
        })
        .catch(error => console.error('Error fetching player data:', error));
}

function placePlayerOnField(playerId, position, isCaptain = false, isViceCaptain = false) {
    const player = playersData[playerId];
    if (!player) return;

    const playerName = player.name;
    const playerPhoto = player.photo;
    let playerPoints = player.points;

    // Double points for Captain
    if (isCaptain) {
        playerPoints *= 2;
    }
    
    const captainMark = isCaptain ? ' (C)' : isViceCaptain ? ' (VC)' : '';

    const footballField = document.getElementById('football-field');
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-position';
    playerDiv.innerHTML = `
        <img src="${playerPhoto}" alt="${playerName}">
        <p>${playerName}${captainMark}</p>
        <p>${playerPoints} pts</p>
    `;

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

function placeSubstitute(playerId, index) {
    const player = playersData[playerId];
    if (!player) return;

    const playerName = player.name;
    const playerPhoto = player.photo;
    const playerPoints = player.points;

    const subContainer = document.querySelector('.substitute-container');
    const subDiv = document.createElement('div');
    subDiv.className = 'substitute-player';
    subDiv.innerHTML = `
        <img src="${playerPhoto}" alt="${playerName}">
        <p>${playerName}</p>
        <p>${playerPoints} pts</p>
    `;

    subContainer.appendChild(subDiv);
}

function fetchAndDisplayPlayerPicks(teamId, gameweek) {
    fetchPlayersData(gameweek)
        .then(() => fetch(`/api/get-player-picks?teamId=${teamId}&gameweek=${gameweek}`))
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);

            const footballField = document.getElementById('football-field');
            footballField.innerHTML = ''; // Clear the field

            const subContainer = document.querySelector('.substitute-container');
            subContainer.innerHTML = ''; // Clear existing subs

            if (data.error) {
                footballField.innerHTML = `<p>Error: ${data.error}</p>`;
                return;
            }

            let totalPoints = 0;
            let substitutesUsed = 0;

            const picks = data.picks || [];
            const substitutes = data.substitutes || [];

            // Determine if the captain and vice-captain played
            let captainId = null;
            let viceCaptainId = null;

            picks.forEach(pick => {
                const player = playersData[pick.element];
                if (player) {
                    if (pick.is_captain) captainId = pick.element;
                    if (pick.is_vice_captain) viceCaptainId = pick.element;
                }
            });

            // Process player picks
            picks.forEach(pick => {
                const player = playersData[pick.element];
                if (player) {
                    let playerPoints = player.points || 0;

                    // Double points for captain
                    if (pick.element === captainId) {
                        playerPoints *= 2;
                    }

                    totalPoints += playerPoints;

                    if (pick.position <= 11) {
                        placePlayerOnField(pick.element, pick.position, pick.is_captain, pick.is_vice_captain);
                    } else {
                        // Display the substitute without including their points in the total
                        placeSubstitute(pick.element, substitutesUsed);
                        substitutesUsed++;
                    }
                }
            });

            // Handle substitutes only if a player didn't play
            substitutes.forEach((sub, subIndex) => {
                const player = playersData[sub.element];
                if (player) {
                    const isPlayerOnField = picks.find(pick => pick.element === sub.element);
                    if (!isPlayerOnField && substitutesUsed < 3) {
                        totalPoints += player.points || 0;
                        placeSubstitute(sub.element, subIndex);
                        substitutesUsed++;
                    }
                }
            });

            // Adjust for vice-captain if captain did not play
            if (captainId && !picks.find(pick => pick.element === captainId)) {
                const viceCaptain = playersData[viceCaptainId];
                if (viceCaptain) {
                    const viceCaptainPoints = viceCaptain.points || 0;
                    totalPoints += viceCaptainPoints;
                }
            }

            console.log('Final calculated total points:', totalPoints); // Log final total points for verification
            document.getElementById('total-points').innerText = `Total Points: ${totalPoints}`;
        })
        .catch(error => {
            console.error('Error fetching player picks:', error);
            document.getElementById('football-field').innerHTML = `<p>Error fetching player picks</p>`;
        });
}

document.getElementById('player-picks-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const teamId = document.getElementById('player-select').value;
    const gameweek = document.getElementById('gameweek-select').value;

    console.log(`Fetching picks for Team ID: ${teamId}, Gameweek: ${gameweek}`);
    fetchAndDisplayPlayerPicks(teamId, gameweek);
});

function fetchAndDisplayStandings(gameweek) {
    fetch(`/api/fpl-standings?gameweek=${gameweek}`)
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

let currentGameweek = 1; // Set this based on default or user selection
if (document.getElementById('standings-table')) {
    fetchAndDisplayStandings(currentGameweek);
}

if (document.getElementById('player-picks-form')) {
    populateManagerSelect();
    fetchPlayersData(currentGameweek);
}
