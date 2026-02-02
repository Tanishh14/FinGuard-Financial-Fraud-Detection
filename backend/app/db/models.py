from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="user")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    merchant = Column(String, index=True)
    amount = Column(Float)
    device_id = Column(String, index=True)
    ip_address = Column(String, index=True)
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    avg_user_spend = Column(Float)
    risk_score = Column(Float, default=0.0)
    decision = Column(String, default="PENDING")

    user = relationship("User", back_populates="transactions")

Index("idx_user_device", Transaction.user_id, Transaction.device_id)
Index("idx_user_ip", Transaction.user_id, Transaction.ip_address)
