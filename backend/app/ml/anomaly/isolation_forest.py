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
