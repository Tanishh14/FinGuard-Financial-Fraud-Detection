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
