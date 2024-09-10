const baseUrl = 'http://localhost:3001/api/';
let playersData = {};
let staticData = {};  // Declare staticData to hold data from bootstrap-static

// Fetch static data
function fetchStaticData() {
    return fetch(`${baseUrl}bootstrap-static/`)
        .then(response => response.json())
        .then(data => {
            staticData = data;
            console.log('Static Data:', staticData);
        })
        .catch(error => console.error('Error fetching static data:', error));
}

// Function to get team ID for a player
function getTeamIdForPlayer(playerId) {
    if (staticData && staticData.elements) {
        console.log(`Looking for player ID: ${playerId}`);
        const player = staticData.elements.find(element => element.id === playerId);
        if (player) {
            console.log(`Found player data for ID ${playerId}:`, player);
            return player.team;  // This is the team ID
        } else {
            console.log(`No player found with ID: ${playerId}`);
            console.log('Available player IDs:', staticData.elements.map(element => element.id));
        }
    }
    return undefined;
}

// Initialize the application
function initializeApp() {
    fetchStaticData().then(() => {
        // Continue with other initialization tasks here, if any
    });
}

// Function to fetch player data for a specific gameweek
function fetchPlayerDataForGameweek(playerId) {
    return fetch(`${baseUrl}element-summary/${playerId}/`)
        .then(response => response.json())
        .then(data => {
            console.log('Full Player Data:', data);

            const gameweekData = data.history.reduce((acc, gw) => {
                acc[gw.round] = {
                    points: gw.total_points,
                    minutes: gw.minutes
                };
                return acc;
            }, {});

            let teamId = getTeamIdForPlayer(playerId);
            if (!teamId) {
                console.error(`Team ID is undefined for player ID ${playerId}. Full data:`, data);
            } else {
                console.log(`Extracted Team ID for Player ID ${playerId}: ${teamId}`);
            }

            const playerPhotoUrl = getTeamKitUrl(teamId);

            console.log(`Fetching kit for team ID: ${teamId}, URL: ${playerPhotoUrl}`);

            playersData[playerId] = {
                name: data.web_name || 'Unknown Player',  // Ensure the name is populated
                photo: playerPhotoUrl,
                gameweekData
            };

            console.log(`Player data stored for ID ${playerId}:`, playersData[playerId]);

            return playersData[playerId];
        })
        .catch(error => console.error(`Error fetching player data for ID ${playerId}:`, error));
}

function fetchPlayerDataForGameweek(playerId) {
    return fetch(`${baseUrl}element-summary/${playerId}/`)
        .then(response => response.json())
        .then(data => {
            console.log('Full Player Data:', data);

            const gameweekData = data.history.reduce((acc, gw) => {
                acc[gw.round] = {
                    points: gw.total_points,
                    minutes: gw.minutes
                };
                return acc;
            }, {});

            // Use static data to get the team ID
            let teamId = getTeamIdForPlayer(playerId);
            if (!teamId) {
                console.error(`Team ID is undefined for player ID ${playerId}. Full data:`, data);
            } else {
                console.log(`Extracted Team ID for Player ID ${playerId}: ${teamId}`);
            }

            // Get the player's name from the static data
            const player = staticData.elements.find(element => element.id === playerId);
            const playerName = player ? player.web_name : 'Unknown Player';

            // Use local team kit images or placeholder
            const playerPhotoUrl = getTeamKitUrl(teamId);

            console.log(`Fetching kit for team ID: ${teamId}, URL: ${playerPhotoUrl}`);

            // Ensure player data is being stored correctly
            playersData[playerId] = {
                name: playerName,  // Use the web_name from static data
                photo: playerPhotoUrl,
                gameweekData
            };

            console.log(`Stored player data for ID ${playerId}:`, playersData[playerId]);

            return playersData[playerId];
        })
        .catch(error => console.error(`Error fetching player data for ID ${playerId}:`, error));
}



// Wait until the DOM is fully loaded to start the initialization
document.addEventListener('DOMContentLoaded', initializeApp);
let currentLeagueId = 352180; // Your actual league ID

// Define a mapping of team IDs to their respective kit image URLs
const localTeamKitUrls = {
    1: "kits/Arsenal.png",           // Arsenal
    2: "kits/Aston-Villa.png",       // Aston Villa
    3: "kits/Bournemouth.png",       // Bournemouth
    4: "kits/Brentford.png",         // Brentford
    5: "kits/Brighton.png",          // Brighton
    6: "kits/Chelsea.png",           // Chelsea
    7: "kits/Crystal-Palace.png",    // Crystal Palace
    8: "kits/Everton.png",           // Everton
    9: "kits/Fulham.png",            // Fulham
    10: "kits/Ipswich.png",          // Ipswich Town
    11: "kits/Leicester.png",        // Leicester City
    12: "kits/Liverpool.png",        // Liverpool
    13: "kits/Man-City.png",         // Manchester City
    14: "kits/Man-Utd.png",          // Manchester United
    15: "kits/Newcastle.png",        // Newcastle United
    16: "kits/Nott'm-Forest.png",    // Nott'm Forest
    17: "kits/Southampton.png",      // Southampton
    18: "kits/Spurs.png",            // Spurs
    19: "kits/West-Ham.png",         // West Ham
    20: "kits/Wolves.png"            // Wolves
};

// Function to get the team kit URL based on team ID
function getTeamKitUrl(teamId) {
    return localTeamKitUrls[teamId] || 'kits/placeholder.png';
}

// Fetch data for a specific player and store gameweek-specific data
function fetchPlayerDataForGameweek(playerId) {
    return fetch(`${baseUrl}element-summary/${playerId}/`)
        .then(response => response.json())
        .then(data => {
            // Log the full player data to inspect its structure
            console.log('Full Player Data:', data);

            console.log('History Data for Player ID:', playerId, data.history);

            if (data.history && data.history.length > 0) {
                console.log('First History Entry for Player ID:', playerId, data.history[0]);
                console.log('Available Keys in First History Entry:', Object.keys(data.history[0]));
            }

            const gameweekData = data.history.reduce((acc, gw) => {
                acc[gw.round] = {
                    points: gw.total_points,
                    minutes: gw.minutes
                };
                return acc;
            }, {});

            // Now let's try to extract the team ID
            let teamId = getTeamIdForPlayer(playerId);

            if (!teamId) {
                console.error(`Team ID is undefined for player ID ${playerId}. Full data:`, data);
            } else {
                console.log(`Extracted Team ID for Player ID ${playerId}: ${teamId}`);
            }

            // Use local team kit images or placeholder
            const playerPhotoUrl = getTeamKitUrl(teamId);

            // Log to verify URL correctness
            console.log(`Fetching kit for team ID: ${teamId}, URL: ${playerPhotoUrl}`);

            // Assign the player's web_name to the name property
            playersData[playerId] = {
                name: staticData.elements.find(element => element.id === playerId).web_name,
                photo: playerPhotoUrl,
                gameweekData
            };

            return playersData[playerId];
        })
        .catch(error => console.error(`Error fetching player data for ID ${playerId}:`, error));
}


// Fetch a team's picks for a specific gameweek
function fetchTeamPicks(teamId, gameweek) {
    return fetch(`${baseUrl}entry/${teamId}/event/${gameweek}/picks/`)
        .then(response => response.json())
        .then(data => {
            console.log(`Team Picks for Team ID ${teamId}, Gameweek ${gameweek}:`, data);
            return data;
        })
        .catch(error => console.error(`Error fetching team picks for Team ID ${teamId}, Gameweek ${gameweek}:`, error));
}

// Fetch standings for a classic league
function fetchLeagueStandings(leagueId) {
    return fetch(`${baseUrl}leagues-classic/${leagueId}/standings/`)
        .then(response => response.json())
        .then(data => {
            console.log(`League Standings for League ID ${leagueId}:`, data);
            return data;
        })
        .catch(error => console.error(`Error fetching league standings for League ID ${leagueId}:`, error));
}

// Define player positions on the field (rotated 180 degrees)
const positions = {
    1: { top: '20%', left: '45%' }, // GK (was 80%)
    2: { top: '35%', left: '75%' }, // DEF Right (was 65% left: 15%)
    3: { top: '35%', left: '55%' }, // DEF Center Right (was 65% left: 35%)
    4: { top: '35%', left: '35%' }, // DEF Center Left (was 65% left: 55%)
    5: { top: '35%', left: '15%' }, // DEF Left (was 65% left: 75%)
    6: { top: '55%', left: '75%' }, // MID Right (was 45% left: 15%)
    7: { top: '55%', left: '55%' }, // MID Center Right (was 45% left: 35%)
    8: { top: '55%', left: '35%' }, // MID Center Left (was 45% left: 55%)
    9: { top: '55%', left: '15%' }, // MID Left (was 45% left: 75%)
    10: { top: '80%', left: '55%' }, // FWD Right (was 20% left: 35%)
    11: { top: '80%', left: '35%' }  // FWD Left (was 20% left: 55%)
};

// Fallback mapping for positions beyond the starting 11
const fallbackPositions = {
    12: { top: '115%', left: '10%' }, // Substitute 1 (left-most)
    13: { top: '115%', left: '30%' }, // Substitute 2
    14: { top: '115%', left: '50%' }, // Substitute 3
    15: { top: '115%', left: '70%' }  // Substitute 4 (right-most)
};

// Place player on the field in the UI
function placePlayerOnField(playerId, position, gameweek, isCaptain = false, isViceCaptain = false) {
    const player = playersData[playerId];
    if (!player || !player.gameweekData[gameweek]) {
        console.error(`No data found for player ID ${playerId} in gameweek ${gameweek}`);
        return;
    }

    const playerName = player.name; // Make sure this is correctly retrieved
    const playerPhoto = player.photo;
    let playerPoints = player.gameweekData[gameweek].points;

    if (isCaptain) {
        playerPoints *= 2;
    }
    
    const captainMark = isCaptain ? ' (C)' : isViceCaptain ? ' (VC)' : '';

    console.log(`Rendering player on field: ${playerName} (ID: ${playerId}) with photo ${playerPhoto}`);

    

    // Determine the correct position
    const positionData = positions[position] || fallbackPositions[position];
    if (!positionData) {
        console.error(`Invalid position ${position} for player ID ${playerId}`);
        return;
    }

    const footballField = document.getElementById('football-field');
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-position';
    playerDiv.innerHTML = `
        <img src="${playerPhoto}" alt="${playerName}">
        <p>${playerName}${captainMark}</p> <!-- Player name should be displayed here -->
        <p>${playerPoints} pts</p>
    `;

    playerDiv.style.top = positionData.top;
    playerDiv.style.left = positionData.left;

    footballField.appendChild(playerDiv);
}


// Place a substitute in the UI
function placeSubstitute(playerId, gameweek, index) {
    const player = playersData[playerId];
    if (!player || !player.gameweekData[gameweek]) {
        console.error(`No data found for player ID ${playerId} in gameweek ${gameweek}`);
        return;
    }

    const playerName = player.name;
    const playerPhoto = player.photo;
    const playerPoints = player.gameweekData[gameweek].points;

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

// Calculate the total points for the gameweek
function calculateTotalPoints(picks, gameweek) {
    let totalPoints = 0;
    let captainPlayed = false;
    let captainId = null;
    let viceCaptainId = null;

    // Identify captain and vice-captain
    picks.forEach(pick => {
        if (pick.is_captain) captainId = pick.element;
        if (pick.is_vice_captain) viceCaptainId = pick.element;
    });

    console.log(`Captain ID: ${captainId}, Vice-Captain ID: ${viceCaptainId}`);

    // Calculate points for the starting 11
    picks.forEach(pick => {
        const player = playersData[pick.element];
        if (player && player.gameweekData[gameweek]) {
            let playerPoints = player.gameweekData[gameweek].points || 0;
            const playerMinutes = player.gameweekData[gameweek].minutes || 0;

            console.log(`Player ID: ${pick.element}, Points: ${playerPoints}, Minutes: ${playerMinutes}`);

            // Handle captain's points
            if (pick.element === captainId) {
                if (playerMinutes > 0) {
                    captainPlayed = true;
                    playerPoints *= 2;
                } else {
                    captainPlayed = false;
                }
                console.log(`Captain Played: ${captainPlayed}, Doubled Points: ${playerPoints}`);
            }

            if (pick.position <= 11 && playerMinutes > 0) {
                totalPoints += playerPoints;
                console.log(`Adding points for player ID ${pick.element}: ${playerPoints}`);
            }
        } else {
            console.log(`No gameweek data found for Player ID ${pick.element}, Gameweek ${gameweek}`);
        }
    });

    // Handle vice-captain points if captain did not play
    if (!captainPlayed && viceCaptainId) {
        const viceCaptain = playersData[viceCaptainId];
        if (viceCaptain && viceCaptain.gameweekData[gameweek] && viceCaptain.gameweekData[gameweek].minutes > 0) {
            const viceCaptainPoints = (viceCaptain.gameweekData[gameweek].points || 0) * 2;
            totalPoints += viceCaptainPoints;
            console.log(`Adding points for vice-captain ID ${viceCaptainId}: ${viceCaptainPoints}`);
        }
    }

    console.log(`Total Points Calculated: ${totalPoints}`);
    return totalPoints;
}

// Fetch and display player picks and calculate total points
function fetchAndDisplayPlayerPicks(teamId, gameweek) {
    fetchTeamPicks(teamId, gameweek)
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

            const picks = data.picks || [];
            const substitutes = data.substitutes || [];

            // Fetch player data for each pick in the team
            const playerDataPromises = picks.map(pick =>
                fetchPlayerDataForGameweek(pick.element)
            );

            // Wait for all player data to be fetched and then proceed
            Promise.all(playerDataPromises)
                .then(() => {
                    // Calculate total points
                    const totalPoints = calculateTotalPoints(picks, gameweek);

                    // Display players on the field
                    picks.forEach(pick => {
                        const player = playersData[pick.element];
                        if (player && player.gameweekData[gameweek] && player.gameweekData[gameweek].minutes > 0) {
                            placePlayerOnField(pick.element, pick.position, gameweek, pick.is_captain, pick.is_vice_captain);
                        } else if (pick.position > 11) {
                            placeSubstitute(pick.element, gameweek, substitutes.length);
                        }
                    });

                    console.log('Final calculated total points:', totalPoints);
                    document.getElementById('total-points').innerText = `Total Points: ${totalPoints}`;
                })
                .catch(error => {
                    console.error('Error processing player data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching player picks:', error);
            document.getElementById('football-field').innerHTML = `<p>Error fetching player picks</p>`;
        });
}

// Event listener for the form submission
document.getElementById('player-picks-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const teamId = document.getElementById('player-select').value;
    const gameweek = document.getElementById('gameweek-select').value;

    console.log(`Fetching picks for Team ID: ${teamId}, Gameweek: ${gameweek}`);
    fetchAndDisplayPlayerPicks(teamId, gameweek);
});

// Fetch and display standings for a gameweek
function fetchAndDisplayStandings(gameweek) {
    fetchLeagueStandings(currentLeagueId)
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

// Populate the manager selection dropdown
function populateManagerSelect() {
    fetchLeagueStandings(currentLeagueId)
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

// Initialize the page
let currentGameweek = 1; // Set this based on default or user selection

if (document.getElementById('standings-table')) {
    fetchAndDisplayStandings(currentGameweek);
}

if (document.getElementById('player-picks-form')) {
    populateManagerSelect();
}
