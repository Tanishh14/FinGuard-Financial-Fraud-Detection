<<<<<<< HEAD
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    "V1","V2","V3","V4","V5","V6","V7","V8","V9","V10",
    "V11","V12","V13","V14","V15","V16","V17","V18","V19","V20",
    "V21","V22","V23","V24","V25","V26","V27","V28","Amount"
]

def load_and_prepare_data(csv_path):
    df = pd.read_csv(csv_path)

    X = df[FEATURE_COLUMNS].values
    y = df["Class"].values  # 0 = normal, 1 = fraud (USED ONLY FOR EVAL)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler
=======
import numpy as np
from datetime import datetime

def extract_transaction_features(tx: dict) -> np.ndarray:
    """
    tx = {
        amount,
        timestamp,
        tx_count_1h,
        tx_count_24h,
        avg_amount_7d,
        merchant_risk_score,
        device_changed (bool)
    }
    """

    ts = datetime.fromisoformat(tx["timestamp"])

    features = np.array([
        tx["amount"],
        ts.hour,
        ts.weekday(),
        tx["tx_count_1h"],
        tx["tx_count_24h"],
        tx["avg_amount_7d"],
        tx["merchant_risk_score"],
        int(tx["device_changed"])
    ], dtype=np.float32)

    return features
>>>>>>> origin/main
