import pandas as pd
import numpy as np
import joblib
import json
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

np.random.seed(42)

size = 500
data = {
    "amount": np.random.normal(50000, 30000, size).clip(100, 200000),
    "hour": np.random.choice(range(24), size=size),
    "device": np.random.choice(["known", "new"], size=size, p=[0.7, 0.3]),
    "location": np.random.choice(["Mumbai", "Delhi"], size=size, p=[0.8, 0.2]),
    "receiver": np.random.choice(["known", "unknown"], size=size, p=[0.8, 0.2]),
}

df = pd.DataFrame(data)
cond = (df.amount > 50000) | ((df.device == "new") & (df.receiver == "unknown"))
df["label"] = cond.astype(int)

with open("stats.json", "w") as f:
    json.dump({"Safe": int((df.label==0).sum()), "High Risk": int((df.label==1).sum())}, f)

df["time"] = df.hour.astype(str) + ":00"
with open("transactions.json", "w") as f:
    json.dump(df.to_dict(orient="records"), f)

le_dev = LabelEncoder(); le_loc = LabelEncoder(); le_rec = LabelEncoder()
df["device_enc"] = le_dev.fit_transform(df.device)
df["location_enc"] = le_loc.fit_transform(df.location)
df["receiver_enc"] = le_rec.fit_transform(df.receiver)

X = df[["amount", "hour", "device_enc", "location_enc", "receiver_enc"]]
y = df.label
model = LogisticRegression(class_weight="balanced", max_iter=500)
model.fit(X, y)

joblib.dump(model, "model.pkl")
joblib.dump(le_dev, "encoder_device.pkl")
joblib.dump(le_loc, "encoder_location.pkl")
joblib.dump(le_rec, "encoder_receiver.pkl")

print("✅ Training Complete")