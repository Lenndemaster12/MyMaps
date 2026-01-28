// Wacht tot DOM volledig geladen is
document.addEventListener("DOMContentLoaded", () => {
  // CSV pad
  const csvFile = "../../api/events_geocoded.csv";

  Papa.parse(csvFile, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;

      data.forEach(e => {
        // Combineer event_date met start_time / end_time
        const startDateTime = new Date(`${e.event_date}T${e.start_time}`);
        const endDateTime = new Date(`${e.event_date}T${e.end_time}`);

        const formattedDate = startDateTime.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' });
        const formattedStartTime = startDateTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
        const formattedEndTime = endDateTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        new maplibregl.Marker({ color: "#e11d48" })
          .setLngLat([parseFloat(e.longitude), parseFloat(e.latitude)])
          .setPopup(
            new maplibregl.Popup().setHTML(`
              <b>${e.title}</b><br>
              Datum: ${formattedDate} van ${formattedStartTime} tot ${formattedEndTime}<br>
              Prijs: €${parseFloat(e.price).toFixed(2)} | ${e.is_open == "1" ? 'Open' : 'Selectie'}<br><br>
              <button onclick="openRouteHome(${e.latitude}, ${e.longitude})">Route hierheen</button>
            `)
          )
          .addTo(map);
      });
    }
  });
});
