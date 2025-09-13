from datetime import datetime
import pandas as pd

CLOCK_COLMN_NAME = "Clock (8:0-0:1.0.0*255:2)"


def get_time_obj_from_dict(d):
    return datetime.strptime(d[CLOCK_COLMN_NAME], "%d.%m.%Y %H:%M:%S")


def get_diff(d1: dict, d2: dict):
    dt = get_time_obj_from_dict(d2) - get_time_obj_from_dict(d1)
    dexp = (
        d2["Active Energy Export (3:1-0:2.8.0*255:2)"]
        - d1["Active Energy Export (3:1-0:2.8.0*255:2)"]
    )
    dimp = (
        d2["Active Energy Import (3:1-0:1.8.0*255:2)"]
        - d1["Active Energy Import (3:1-0:1.8.0*255:2)"]
    )
    return {
        "Import Delta": dimp,
        "Export Delta": dexp,
        "Time Delta": str(dt),
        "Date of Second Val": str(get_time_obj_from_dict(d2)),
    }


def get_diffs(d: list[dict]) -> list[dict]:
    return list(map(get_diff, d, d[1:]))


def get_timed_diffs(data: dict, ids: list[str], time: str) -> list[dict]:
    # Getting the ids back in column
    df = (
        pd.concat({k: pd.DataFrame(v) for k, v, in data.items()}, names=["Meter"])
        .reset_index(level=0)
        .reset_index(drop=True)
    )

    df = df[df["Meter"].isin(ids) & (df[CLOCK_COLMN_NAME] == time)]
    df = df[
        [
            "Meter",
            "Active Energy Export (3:1-0:2.8.0*255:2)",
            "Active Energy Import (3:1-0:1.8.0*255:2)",
            CLOCK_COLMN_NAME,
        ]
    ].to_dict(orient="records")

    return {
        row["Meter"]: {
            "Export": row["Active Energy Export (3:1-0:2.8.0*255:2)"],
            "Import": row["Active Energy Import (3:1-0:1.8.0*255:2)"],
            "Clock": row[CLOCK_COLMN_NAME],
        }
        for row in df
    }


def calc_diff_from_two_timed_arrays(d2: dict, d1: dict):
    return {
        m_id: {
            "Export Delta": d2[m_id]["Export"] - d1[m_id]["Export"],
            "Import Delta": d2[m_id]["Import"] - d1[m_id]["Import"],
        }
        for m_id, _ in d2.items()
    }


def calc_diff_timed(data: dict, ids: list[str], t2: str, t1: str) -> dict:
    d2 = get_timed_diffs(data, ids, t2)
    d1 = get_timed_diffs(data, ids, t1)
    return calc_diff_from_two_timed_arrays(d2, d1)


if __name__ == "__main__":

    import json

    data = {}
    # Opening JSON file
    with open("../data/data.json") as json_file:
        data: dict = json.load(json_file)

    print(
        calc_diff_timed(
            data, ["14101593", "14381560"], "01.06.2025 14:15:00", "01.06.2025 14:00:00"
        )
    )
