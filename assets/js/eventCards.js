document.addEventListener("DOMContentLoaded", () => {
    const routesContainer = document.getElementById("eventCards");
    const now = new Date();

    Papa.parse("api/events.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;

            if (data.length === 0) {
                routesContainer.innerHTML = "<p>Geen events gevonden.</p>";
                return;
            }

            // Split active / past events
            const activeEvents = [];
            const pastEvents = [];

            data.forEach(e => {
                const endDate = new Date(`${e.event_date}T${e.end_time}`);
                if (endDate >= now) activeEvents.push(e);
                else pastEvents.push(e);
            });

            function createCard(e, isPast=false) {
                const startDate = new Date(`${e.event_date}T${e.start_time}`);
                const endDate = new Date(`${e.event_date}T${e.end_time}`);

                const formattedDate = startDate.toLocaleDateString('nl-NL', { day:'2-digit', month:'2-digit' });
                const formattedStart = startDate.toLocaleTimeString('nl-NL', { hour:'2-digit', minute:'2-digit' });
                const formattedEnd = endDate.toLocaleTimeString('nl-NL', { hour:'2-digit', minute:'2-digit' });

                const card = document.createElement("div");
                card.classList.add("route-card");
                if (isPast) {
                    card.classList.add("past-event");
                    card.style.opacity = 0.5;
                    card.style.filter = "blur(1px)";
                }

                card.innerHTML = `
                    <p class="routedescription">${e.title}</p>
                    <p class="routename">${e.street} ${e.number}, ${e.postal_code} ${e.city}</p>
                    <p>Datum: ${formattedDate} van ${formattedStart} tot ${formattedEnd}</p>
                    <p>Prijs: €${parseFloat(e.price).toFixed(2)} | ${e.is_open=="1" ? 'Open' : 'Selectie'}</p>
                    <button onclick="openRouteEvents(${e.latitude}, ${e.longitude})">Route hierheen</button>
                `;
                routesContainer.appendChild(card);
            }

            activeEvents.forEach(e => createCard(e));
            pastEvents.forEach(e => createCard(e, true));
        }
    });
});
