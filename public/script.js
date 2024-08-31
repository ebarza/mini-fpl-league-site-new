document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/bootstrap-static')  // Example API endpoint
    .then(response => response.json())
    .then(data => {
        const leagueDiv = document.getElementById('league-data');
        leagueDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    })
    .catch(error => console.error('Error fetching league data:', error));
});

