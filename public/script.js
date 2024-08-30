document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/league') // Adjust the endpoint if necessary
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('data-container');
            container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => console.error('Error fetching data:', error));
});
