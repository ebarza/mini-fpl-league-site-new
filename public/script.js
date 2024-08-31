document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/fpl-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log data to console for testing
        displayData(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});

function displayData(data) {
    const displayElement = document.getElementById('data-display');
    displayElement.textContent = JSON.stringify(data, null, 2); // Display data as formatted JSON
}



