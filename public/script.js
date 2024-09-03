fetch('/api/fpl-standings')
  .then(response => response.json())
  .then(data => {
    const standings = data.standings.results;
    const tableBody = document.getElementById('fpl-standings-body');

    standings.forEach(team => {
      const rank = team.rank;
      const teamName = team.entry_name;
      const managerName = team.player_name;
      const gwPoints = team.event_total;
      const totalPoints = team.total;

      // Create a new table row
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${rank}</td>
        <td>${teamName}</td>
        <td>${managerName}</td>
        <td>${gwPoints}</td>
        <td>${totalPoints}</td>
      `;

      // Append the row to the table body
      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error('Error fetching FPL data:', error));






