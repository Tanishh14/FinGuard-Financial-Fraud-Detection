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
