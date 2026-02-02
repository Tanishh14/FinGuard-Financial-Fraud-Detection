from pydantic import BaseModel
from datetime import datetime

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "user"

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    role: str

class TransactionIn(BaseModel):
    user_id: int
    merchant: str
    amount: float
    device_id: str
    ip_address: str
    location: str

class TransactionOut(BaseModel):
    id: int
    user_id: int
    merchant: str
    amount: float
    device_id: str
    ip_address: str
    location: str
    avg_user_spend: float
    risk_score: float
    decision: str
    timestamp: datetime

    class Config:
        orm_mode = True
