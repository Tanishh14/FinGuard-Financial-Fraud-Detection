import torch
import numpy as np
from .features import extract_transaction_features
from .autoencoder import TransactionAutoencoder
from .isolation_forest import TransactionIsolationForest

class AnomalyService:
    def __init__(self, ae: TransactionAutoencoder, iforest: TransactionIsolationForest):
        self.ae = ae.eval()
        self.iforest = iforest

    def score_transaction(self, tx: dict) -> dict:
        x = extract_transaction_features(tx)
        x_tensor = torch.tensor(x).unsqueeze(0)

        with torch.no_grad():
            ae_score = self.ae.anomaly_score(x_tensor).item()

        if_score = self.iforest.score(np.array([x]))[0]

        return {
            "ae_score": ae_score,
            "if_score": if_score
        }
