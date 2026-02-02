import torch
from torch_geometric.nn import SAGEConv

class FraudGNN(torch.nn.Module):
    def __init__(self, in_dim: int):
        super().__init__()

        self.conv1 = SAGEConv(in_dim, 64)
        self.conv2 = SAGEConv(64, 1)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index)
        return torch.sigmoid(x).squeeze()
