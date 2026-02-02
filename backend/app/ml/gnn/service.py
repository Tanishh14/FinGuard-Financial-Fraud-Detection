import torch

class GNNService:
    def __init__(self, model):
        self.model = model.eval()

    def score_nodes(self, graph):
        with torch.no_grad():
            return self.model(graph.x, graph.edge_index)
