// -------------------------------
// België bounds | home.php
// -------------------------------
const belgieBounds = [
    [2.54, 49.49], // SW (lng, lat)
    [6.41, 51.51]  // NE
];

// -------------------------------
// Map initialisatie | home.php
// -------------------------------
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets-v2-dark/style.json?key=ihIEZcTjnQisVxfkqQH3',
    center: [4.3517, 50.8503], // Brussel
    zoom: 8,
    maxBounds: belgieBounds,
    minZoom: 7,
    maxZoom: 18
});

map.addControl(new maplibregl.NavigationControl());

setTimeout(() => map.resize(), 300);
window.addEventListener("resize", () => map.resize());
window.addEventListener("orientationchange", () => setTimeout(() => map.resize(), 300));


