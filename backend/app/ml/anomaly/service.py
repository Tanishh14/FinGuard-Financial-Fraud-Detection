import torch
<<<<<<< HEAD
import torch.nn as nn
import torch.optim as optim
import numpy as np

class AutoEncoder(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 32),
            nn.ReLU(),
            nn.Linear(32, 8)
        )
        self.decoder = nn.Sequential(
            nn.Linear(8, 32),
            nn.ReLU(),
            nn.Linear(32, 128),
            nn.ReLU(),
            nn.Linear(128, input_dim)
        )

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)


def train_autoencoder(X_train, X_val, epochs=50, patience=5):
    device = "cuda" if torch.cuda.is_available() else "cpu"

    model = AutoEncoder(X_train.shape[1]).to(device)
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.MSELoss()

    X_train = torch.tensor(X_train, dtype=torch.float32).to(device)
    X_val = torch.tensor(X_val, dtype=torch.float32).to(device)

    best_loss = float("inf")
    counter = 0

    train_losses, val_losses = [], []

    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        recon = model(X_train)
        train_loss = criterion(recon, X_train)
        train_loss.backward()
        optimizer.step()

        model.eval()
        with torch.no_grad():
            val_recon = model(X_val)
            val_loss = criterion(val_recon, X_val)

        train_losses.append(train_loss.item())
        val_losses.append(val_loss.item())

        print(
            f"Epoch {epoch+1}/{epochs} | "
            f"Train: {train_loss.item():.6f} | "
            f"Val: {val_loss.item():.6f}"
        )

        if val_loss < best_loss:
            best_loss = val_loss
            counter = 0
        else:
            counter += 1
            if counter >= patience:
                print("⏹ Early stopping")
                break

    return model, train_losses, val_losses


def ae_scores(model, X):
    device = next(model.parameters()).device
    X = torch.tensor(X, dtype=torch.float32).to(device)

    model.eval()
    with torch.no_grad():
        recon = model(X)
        scores = torch.mean((X - recon) ** 2, dim=1)

    return scores.cpu().numpy()
=======
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
>>>>>>> origin/main
