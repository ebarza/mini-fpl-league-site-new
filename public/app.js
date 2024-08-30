document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/bootstrap-static')
    .then(response => response.json())
    .then(data => {
        const leagueDiv = document.getElementById('league-info');
        leagueDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    })
    .catch(error => console.error('Error fetching league data:', error));
});
