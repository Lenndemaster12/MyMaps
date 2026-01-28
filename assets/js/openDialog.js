document.addEventListener('DOMContentLoaded', () => {
    let selectedDestination = null;

    function openRouteHome(lat, lng){
        selectedDestination = {lat,lng};
        const dialog = document.getElementById('routeDialogHome');
        if(dialog) dialog.style.display = 'flex';
    }

    function openRouteEvents(lat, lng){
        selectedDestination = {lat,lng};
        const dialog = document.getElementById('routeDialogEvents');
        if(dialog) dialog.style.display = 'flex';
    }

    const setupDialog = (dialogId) => {
        const dialog = document.getElementById(dialogId);
        if(!dialog) return;
        dialog.querySelector('#routeGoogle').addEventListener('click', () => {
            if(selectedDestination){
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedDestination.lat},${selectedDestination.lng}&travelmode=driving`, '_blank');
            }
            dialog.style.display = 'none';
        });
        dialog.querySelector('#routeWaze').addEventListener('click', () => {
            if(selectedDestination){
                window.open(`https://waze.com/ul?ll=${selectedDestination.lat},${selectedDestination.lng}&navigate=yes`, '_blank');
            }
            dialog.style.display = 'none';
        });
        dialog.querySelector('#routeCancel').addEventListener('click', () => {
            dialog.style.display = 'none';
        });
    };

    setupDialog('routeDialogHome');
    setupDialog('routeDialogEvents');

    // Globale functies zodat onclick="openRoute(...)" werkt
    window.openRouteHome = openRouteHome;
    window.openRouteEvents = openRouteEvents;
});