document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/bootstrap-static')
        .then(response => response.json())
        .then(data => {
            const fplDataContainer = document.getElementById('fpl-data');
            if (data) {
                fplDataContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            } else {
                fplDataContainer.innerHTML = 'No data available';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('fpl-data').innerHTML = 'Failed to load data.';
        });
});


