import pandas as pd
import requests
import time

# --- Input/Output ---
excel_input = "C:/Users/Lenn/Desktop/mymaps static/api/events.xlsx"
excel_output = "C:/Users/Lenn/Desktop/mymaps static/api/events_geocoded.xlsx"
csv_output = "C:/Users/Lenn/Desktop/mymaps static/api/events_geocoded.csv"  # nieuw

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
    print(f"\n--- Geocoding row {idx+1}/{len(df)}: {row.get('title','(geen titel)')} ---")
    
    # --- Veilig city en street ophalen ---
    city_osm = city_mapping.get(row['city'], str(row['city']) if pd.notna(row['city']) else "")
    street_corrected = str(row['street']) if pd.notna(row['street']) else ""
    
    # --- Number veilig omzetten ---
    if pd.isna(row['number']):
        number = ""
    else:
        if isinstance(row['number'], float):
            number = str(int(row['number']))
        else:
            number = str(row['number'])
    
    # --- Postal code veilig omzetten ---
    if pd.isna(row['postal_code']):
        postal_code = ""
    else:
        if isinstance(row['postal_code'], float):
            postal_code = str(int(row['postal_code']))
        else:
            postal_code = str(row['postal_code'])
    
    # --- Region veilig ophalen ---
    region = str(row['region']) if pd.notna(row['region']) else ""
    
    # --- Speciale tekens corrigeren ---
    for wrong, correct in street_corrections.items():
        street_corrected = street_corrected.replace(wrong, correct)
    
    # --- Volledig adres bouwen ---
    country = str(row['country']) if pd.notna(row['country']) else "Belgium"
    address_parts = [street_corrected, number, postal_code, city_osm, region, country]
    full_address = " ".join([part for part in address_parts if part != ""])
    
    print(f"Proberen te geocoderen: {full_address}")
    
    url = "https://nominatim.openstreetmap.org/search"
    lat, lon = "", ""
    
    # --- Eerste poging: volledig adres ---
    try:
        response = requests.get(url, params={"q": full_address, "format": "json", "limit": 1},
                                headers={"User-Agent": "my_events_app"}, timeout=10)
        data = response.json()
        if data:
            lat, lon = data[0]['lat'], data[0]['lon']
            print(f"✅ Gevonden: lat={lat}, lon={lon}")
        else:
            print("⚠️ Niet gevonden op volledig adres, probeer fallback...")
    except Exception as e:
        print(f"❌ Fout bij eerste geocode poging: {e}")
    
    # --- Fallback: postcode + stad ---
    if lat == "" or lon == "":
        fallback_address = " ".join([postal_code, city_osm, country])
        print(f"Fallback geocode: {fallback_address}")
        try:
            response = requests.get(url, params={"q": fallback_address, "format": "json", "limit": 1},
                                    headers={"User-Agent": "my_events_app"}, timeout=10)
            data = response.json()
            if data:
                lat, lon = data[0]['lat'], data[0]['lon']
                print(f"✅ Fallback gevonden: lat={lat}, lon={lon}")
            else:
                print(f"❌ Adres helemaal niet gevonden: {full_address}")
        except Exception as e:
            print(f"❌ Fout bij fallback geocoding: {fallback_address} → {e}")
    
    latitudes.append(lat)
    longitudes.append(lon)
    
    time.sleep(1)  # respecteer rate-limit Nominatim

# --- Voeg toe aan DataFrame ---
df['latitude'] = latitudes
df['longitude'] = longitudes

# --- Opslaan naar nieuwe Excel ---
df.to_excel(excel_output, index=False)
print(f"\n🎉 Geocoding klaar! Excel opgeslagen als {excel_output}")

# --- Opslaan naar CSV ---
df.to_csv(csv_output, index=False)
print(f"🎉 CSV ook opgeslagen als {csv_output}")
