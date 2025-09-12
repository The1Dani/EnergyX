import pandas as pd
import filename

def read_one_file(file:str) -> dict:
    df = pd.read_csv(file)
    print(df.columns)
    return df.groupby("Meter").apply(lambda x: x.drop(columns="Meter").to_dict(orient="records")).to_dict()

    

def read_all_files() -> list[dict]:
    return read_one_file(f"../data/{filename.get_all_file_names()[0]}")
    return [read_one_file(f"../data/{f}") for f in filename.get_all_file_names()]


def main():
    print(read_all_files())

if __name__ == "__main__" :
    main()