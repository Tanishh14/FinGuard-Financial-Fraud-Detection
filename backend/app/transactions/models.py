from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    merchant = Column(String, index=True)
    amount = Column(Float)
    device_id = Column(String, index=True)
    ip_address = Column(String, index=True)
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    avg_user_spend = Column(Float)
    risk_score = Column(Float, default=0.0)
    decision = Column(String, default="PENDING")

    user = relationship("User")
