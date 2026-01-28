document.addEventListener("DOMContentLoaded", () => {
    const routesContainer = document.getElementById("eventCards");
    const now = new Date();

    // Helper om datum en tijd correct te parsen
    function parseEventDate(dateStr, timeStr) {
        if (!dateStr || dateStr.trim() === "") return null;

        // Alleen YYYY-MM-DD gedeelte gebruiken
        let datePart = dateStr.split(" ")[0]; 

        // Gebruik start_time of fallback naar 00:00
        let timePart = timeStr && timeStr.trim() !== "" ? timeStr : "00:00";

        return new Date(`${datePart}T${timePart}`);
    }

    Papa.parse("../../api/events_geocoded.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;

            if (!data || data.length === 0) {
                routesContainer.innerHTML = "<p>Geen events gevonden.</p>";
                return;
            }

            const activeEvents = [];
            const pastEvents = [];

            // Split active / past events
            data.forEach(e => {
                const startDate = parseEventDate(e.event_date, e.start_time);
                const endDate = parseEventDate(e.event_date, e.end_time) || (startDate ? new Date(startDate.getTime() + 3600*1000) : null);

                e._startDate = startDate;
                e._endDate = endDate;

                if (startDate && endDate && endDate >= now) activeEvents.push(e);
                else pastEvents.push(e);
            });

            function createCard(e, isPast=false) {
                const startDate = e._startDate;
                const endDate = e._endDate;

                const formattedDate = startDate ? startDate.toLocaleDateString('nl-NL', { day:'2-digit', month:'2-digit', year:'numeric' }) : "Onbekend";
                const formattedStart = startDate ? startDate.toLocaleTimeString('nl-NL', { hour:'2-digit', minute:'2-digit' }) : "Onbekend";
                const formattedEnd = endDate ? endDate.toLocaleTimeString('nl-NL', { hour:'2-digit', minute:'2-digit' }) : "Onbekend";

                const addressParts = [e.street, e.number, e.postal_code, e.city];
                const address = addressParts.filter(p => p && p.trim() !== "").join(" ") || "Adres onbekend";

                const price = e.price && !isNaN(parseFloat(e.price)) ? parseFloat(e.price).toFixed(2) : "Onbekend";

                const card = document.createElement("div");
                card.classList.add("route-card");
                if (isPast) {
                    card.classList.add("past-event");
                    card.style.opacity = 0.5;
                    card.style.filter = "blur(1px)";
                }

                // Bepaal label(s): vip en/of selectie
                let labelHTML = "";

                // Selectie label (is_open == 0)
                if (Number(e.is_open) === 0.0) {
                    labelHTML += `<span class="event-label selectie">Selectie</span>`;
                }

                // VIP label
                if (Number(e.is_vip) === 0.0) {
                    labelHTML += `<span class="event-label vip">VIP</span> `;
                }


                // Plaats labelHTML boven titel
                card.innerHTML = `
                    <div>${labelHTML}</div>  <!-- hier komen VIP/Selectie labels -->
                    <p class="routedescription">${e.title || "Geen titel"}</p>
                    <p class="routename">${address}</p>
                    <p>Datum: ${formattedDate} van ${formattedStart} tot ${formattedEnd}</p>
                    <p>Prijs: €${price} | ${e.is_open=="1.0" ? 'Open' : 'Selectie'}</p>
                    <div class="buttons-container">
                        <button onclick="window.open('${e.facebook}', '_blank')"><i class="ri-facebook-fill"></i></button>
                        <button onclick="openRouteEvents(${e.latitude || 0}, ${e.longitude || 0})" id="openRoute"><i class="ri-corner-down-right-line"></i></button>
                    </div>
                `;

                routesContainer.appendChild(card);
            }

            // Eerst actieve events, dan verlopen events
            activeEvents.forEach(e => createCard(e));
            pastEvents.forEach(e => createCard(e, true));
        }
    });
});