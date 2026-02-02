from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import List
from app.core.dependencies import get_current_user
from app.auth.models import User

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

async def realtime_transactions_ws(
    websocket: WebSocket,
    user: User = Depends(get_current_user)
):
    """
    WebSocket endpoint for realtime transaction feed.
    Only authenticated users can connect.
    Admins receive all transactions.
    Users receive only their own (later filtering).
    """
    await manager.connect(websocket)

    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
