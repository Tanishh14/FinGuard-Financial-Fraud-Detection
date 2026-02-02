import torch
import torch.nn as nn

class TransactionAutoencoder(nn.Module):
    def __init__(self, input_dim: int):
        super().__init__()

        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 16)   # bottleneck
        )

        self.decoder = nn.Sequential(
            nn.Linear(16, 64),
            nn.ReLU(),
            nn.Linear(64, input_dim)
        )

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)

    def anomaly_score(self, x: torch.Tensor) -> torch.Tensor:
        """
        Reconstruction error = ||x - x_hat||^2
        """
        x_hat = self.forward(x)
        return torch.mean((x - x_hat) ** 2, dim=1)
