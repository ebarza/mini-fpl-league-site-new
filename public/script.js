// Fetch and display league standings
function fetchStandings() {
    fetch('/api/fpl-standings')
        .then(response => response.json())
        .then(data => {
            const standingsTableBody = document.querySelector('#standings-table tbody');
            standingsTableBody.innerHTML = ''; // Clear any existing data

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
        .catch(error => {
            console.error('Error fetching league standings:', error);
        });
}

// Fetch and display player picks
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
                    picksResult.innerHTML += `<p>Player ID: ${pick.element}, Position: ${pick.position}</p>`;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching player picks:', error);
        });
});

// Initialize the page by fetching the standings
fetchStandings();




