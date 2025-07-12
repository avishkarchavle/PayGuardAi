import json
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model = joblib.load("model.pkl")
enc_dev = joblib.load("encoder_device.pkl")
enc_loc = joblib.load("encoder_location.pkl")
enc_rec = joblib.load("encoder_receiver.pkl")

class TxnData(BaseModel):
    userId: str; amount: float; time: str
    device: str; location: str; receiver: str
    prev_locations: list; prev_times: list

@app.get("/stats")
def get_stats():
    with open("stats.json") as f: return json.load(f)

@app.get("/transactions")
def get_txns():
    with open("transactions.json") as f: return json.load(f)

@app.post("/predict")
def predict(txn: TxnData):
    try:
        df = pd.DataFrame([{
            "amount": txn.amount,
            "hour": int(txn.time.split(":")[0]),
            "device": txn.device,
            "location": txn.location,
            "receiver": txn.receiver
        }])
        df["device"] = enc_dev.transform(df["device"])
        df["location"] = enc_loc.transform(df["location"])
        df["receiver"] = enc_rec.transform(df["receiver"])
        pred = model.predict(df)[0]
        prob = model.predict_proba(df)[0][1]
        return {"prediction": "High Risk" if pred else "Safe", "confidence": round(prob, 3)}
    except Exception as e:
        return {"error": str(e)}