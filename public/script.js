// Assuming script.js is correctly linked in your index.html

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/bootstrap-static')
        .then(response => response.json())
        .then(data => {
            displayData(data);
        })
        .catch(error => console.error('Error fetching FPL data:', error));
});

function displayData(data) {
    const container = document.getElementById('data-container'); // Make sure you have a div with id="data-container" in your HTML
    container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`; // This line will display the data in formatted JSON. You can replace this with a more sophisticated display logic.
}




