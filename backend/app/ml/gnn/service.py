import torch

class GNNService:
    def __init__(self, model):
        self.model = model.eval()

    @torch.no_grad()
    def score_nodes(self, graph):
        return self.model(graph.x, graph.edge_index)
