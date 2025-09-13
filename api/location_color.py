
import json
from diff_data import calc_diff_timed
import os
import pandas as pd

def get_color_json(data:dict, cloc:str) -> dict:

    t = cloc.split(" ")
    hour = t[1]
    day = t[0]

    meter_map_file = "../data/daniel_data/meter_to_location.json"

    # Try to load meter-to-location mapping from file

    # Try to load location-to-meters mapping from file
    if os.path.exists(meter_map_file):
        with open(meter_map_file, "r", encoding="utf-8") as f:
            location_to_meters = json.load(f)
        # Convert meter IDs back to int
        location_to_meters = {loc: [int(m) for m in meters] for loc, meters in location_to_meters.items()}

    all_meter_ids = [str(meter) for meters in location_to_meters.values() for meter in meters]


    # Example usage: input day and hour, then call calc_diff_timed for each location
    
    from datetime import datetime, timedelta
    dt = datetime.strptime(f"{day} {hour}", "%d.%m.%Y %H:%M:%S")
    prev_dt = dt - timedelta(hours=1)
    t2 = dt.strftime("%d.%m.%Y %H:%M:%S")
    t1 = prev_dt.strftime("%d.%m.%Y %H:%M:%S")





    # Call calc_diff_timed once for all meters
    diff = calc_diff_timed(data, all_meter_ids, t2, t1)

    # For one location, print all Import Delta values before summing

    # For one location, print all Import Delta values before summing, warn if missing


    # Print dictionary of location: total_consumption for all locations
    # print(location_to_meters)
    location_consumption = {}
    for location, meters in location_to_meters.items():
        total_consumption = sum(diff.get(str(m), {}).get("Import Delta", 0) for m in meters)
        location_consumption[location] = total_consumption

    # Function to assign RGB color based on consumption
    def get_color_for_consumption(consumption, min_val, max_val):
        if max_val == min_val:
            # Avoid division by zero, assign green
            return (0, 255, 0)
        percent = (consumption - min_val) / (max_val - min_val) * 100
        if percent <= 25:
            # Green to Yellow
            # 0%: green (0,255,0), 25%: yellow (255,255,0)
            r = int(255 * (percent / 25))
            g = 255
            b = 0
        elif percent <= 75:
            # Yellow to Red
            # 25%: yellow (255,255,0), 75%: red (255,0,0)
            r = 255
            g = int(255 * (1 - (percent - 25) / 50))
            b = 0
        else:
            # 75%-100%: red (255,0,0)
            r = 255
            g = 0
            b = 0
        return (r, g, b)

    # Calculate min, max, avg
    values = list(location_consumption.values())
    # print(values)
    min_val = min(values)
    max_val = max(values)
    avg_val = sum(values) / len(values) if values else 0


    # Load coordinates from locations.csv
    coords_df = pd.read_csv("../data/daniel_data/locations.csv")
    coords_map = {row["Name"]: (row["Latitude"], row["Longitude"]) for _, row in coords_df.iterrows()}

    # Build new dictionary with color and coordinates
    location_consumption_with_color = {}
    for location, consumption in location_consumption.items():
        color = get_color_for_consumption(consumption, min_val, max_val)
        coord = coords_map.get(location)
        location_consumption_with_color[location] = {
            "consumption": consumption,
            "color": color,
            "coordonates": coord
        }
    return location_consumption_with_color

if __name__ == "__main__":
    print(get_color_json("01.06.2025 14:00:00"))