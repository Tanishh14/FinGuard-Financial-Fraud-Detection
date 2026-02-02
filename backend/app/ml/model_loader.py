import torch
from .anomaly.autoencoder import TransactionAutoencoder
from .anomaly.isolation_forest import TransactionIsolationForest
from .gnn.model import FraudGNN

def load_models():
    ae = TransactionAutoencoder(input_dim=8)
    ae.load_state_dict(torch.load("models/autoencoder.pt"))

    iforest = TransactionIsolationForest()
    iforest.model = torch.load("models/iforest.pkl")

    gnn = FraudGNN(in_dim=6)
    gnn.load_state_dict(torch.load("models/gnn.pt"))

    return ae, iforest, gnn
