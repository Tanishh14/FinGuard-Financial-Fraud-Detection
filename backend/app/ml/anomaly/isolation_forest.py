import numpy as np
from sklearn.ensemble import IsolationForest

class TransactionIsolationForest:
    def __init__(self):
        self.model = IsolationForest(
            n_estimators=200,
            contamination=0.01,
            random_state=42
        )

    def fit(self, X: np.ndarray):
        self.model.fit(X)

    def score(self, X: np.ndarray) -> np.ndarray:
        """
        Convert sklearn output to anomaly score [0,1]
        """
        scores = -self.model.score_samples(X)
        return (scores - scores.min()) / (scores.max() - scores.min() + 1e-6)
