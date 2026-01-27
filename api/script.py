import pandas as pd
import requests
import time

# --- Input/Output ---
excel_input = "C:/Users/Lenn/Desktop/mymaps static/api/events.xlsx"
excel_output = "C:/Users/Lenn/Desktop/mymaps static/api/events_geocoded.xlsx"

df = pd.read_excel(excel_input)

# --- Belgische steden naar OSM-namen ---
city_mapping = {
    "Brussel": "Bruxelles",
    "Luik": "Liège",
    "Antwerpen": "Antwerpen",
    "Gent": "Gent",
    "Leuven": "Leuven",
    "Hasselt": "Hasselt"
}

# --- Speciale tekens correctie ---
street_corrections = {
    "Strasse": "Straße",
    "strasse": "straße"
    # je kan hier meer regels toevoegen
}

latitudes = []
longitudes = []

for idx, row in df.iterrows():
    # --- Pas stad en straat aan ---
    city_osm = city_mapping.get(row['city'], row['city'])
    street_corrected = row['street']
    for wrong, correct in street_corrections.items():
        street_corrected = street_corrected.replace(wrong, correct)
    
    # --- Volledig adres ---
    full_address = f"{street_corrected} {row['number']}, {row['postal_code']} {city_osm}, {row['region']}, Belgium"
    
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": full_address, "format": "json", "limit": 1}
    
    lat, lon = "", ""
    try:
        response = requests.get(url, params=params, headers={"User-Agent": "my_events_app"}, timeout=10)
        data = response.json()
        if data:
            lat, lon = data[0]['lat'], data[0]['lon']
    except:
        pass
    
    # --- Fallback: postcode + stad ---
    if lat == "" or lon == "":
        fallback_address = f"{row['postal_code']} {city_osm}, Belgium"
        try:
            response = requests.get(url, params={"q": fallback_address, "format": "json", "limit": 1},
                                    headers={"User-Agent": "my_events_app"}, timeout=10)
            data = response.json()
            if data:
                lat, lon = data[0]['lat'], data[0]['lon']
            else:
                print(f"Adres helemaal niet gevonden: {full_address}")
        except Exception as e:
            print(f"Fout bij fallback geocoding: {fallback_address} → {e}")
    
    latitudes.append(lat)
    longitudes.append(lon)
    
    time.sleep(1)  # respecteer rate-limit Nominatim

# --- Voeg toe aan DataFrame ---
df['latitude'] = latitudes
df['longitude'] = longitudes

# --- Opslaan naar nieuwe Excel ---
df.to_excel(excel_output, index=False)
print(f"Geocoding klaar! Excel opgeslagen als {excel_output}")
