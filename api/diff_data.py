from datetime import datetime

def get_time_obj_from_dict(d):
    return datetime.strptime(d["Clock (8:0-0:1.0.0*255:2)"], "%d.%m.%Y %H:%M:%S")


def get_diff(d1:dict, d2:dict):
    dt = get_time_obj_from_dict(d2) - get_time_obj_from_dict(d1)
    dexp = d2["Active Energy Export (3:1-0:2.8.0*255:2)"] - d1["Active Energy Export (3:1-0:2.8.0*255:2)"]
    dimp = d2["Active Energy Import (3:1-0:1.8.0*255:2)"] - d1["Active Energy Import (3:1-0:1.8.0*255:2)"]
    return {
        "Import Delta": dimp,
        "Export Delta": dexp,
        "Time Delta": str(dt),
        "Date of Second Val": str(get_time_obj_from_dict(d2))
    }

def get_diffs(d: list[dict]) -> list[dict]:
    return list(map(get_diff, d, d[1:]))

if __name__ == "__main__":
    
    import json
    data = {}
    # Opening JSON file
    with open('../data/data.json') as json_file:
        data:dict = json.load(json_file)
    
    d = data["14101619"]

    get_diffs(d)