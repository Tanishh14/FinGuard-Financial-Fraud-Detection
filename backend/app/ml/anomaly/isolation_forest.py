<<<<<<< HEAD
from sklearn.ensemble import IsolationForest


def train_isolation_forest(
    X,
    n_estimators=200,
    max_samples="auto",
    contamination=0.01,
    random_state=42,
):
    """
    Train Isolation Forest on normal transactions only
    """

    model = IsolationForest(
        n_estimators=n_estimators,
        max_samples=max_samples,
        contamination=contamination,
        random_state=random_state,
        n_jobs=-1,
    )

    model.fit(X)
    return model


def anomaly_score(model, X):
    """
    Convert IF output to anomaly scores (higher = more anomalous)
    """
    # decision_function: higher = more normal
    scores = -model.decision_function(X)
    return scores
=======
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
>>>>>>> origin/main
