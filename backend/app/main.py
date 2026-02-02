from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.auth.router import router as auth_router
from app.transactions.router import router as tx_router
from app.realtime.timewebsocket import realtime_transactions_ws

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinGuard AI", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(tx_router, prefix="/transactions", tags=["Transactions"])
app.websocket("/ws/transactions")(realtime_transactions_ws)

@app.get("/")
def root():
    return {"status": "FinGuard AI Backend Running"}
