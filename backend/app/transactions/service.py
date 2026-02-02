from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.transactions.models import Transaction

def create_transaction(
    db: Session,
    user_id: int,
    merchant: str,
    amount: float,
    device_id: str,
    ip_address: str,
    location: str
):
    avg_spend = db.query(func.avg(Transaction.amount))\
        .filter(Transaction.user_id == user_id)\
        .scalar() or 0.0

    tx = Transaction(
        user_id=user_id,
        merchant=merchant,
        amount=amount,
        device_id=device_id,
        ip_address=ip_address,
        location=location,
        avg_user_spend=avg_spend,
        timestamp=datetime.utcnow()
    )

    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx
