from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.db.session import SessionLocal
from app.db.models import Transaction
from app.schemas.api import TransactionIn, TransactionOut
from app.core.security import get_current_user, admin_only

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=TransactionOut)
def ingest_transaction(
    payload: TransactionIn,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    avg_spend = db.query(func.avg(Transaction.amount))\
        .filter(Transaction.user_id == payload.user_id).scalar() or 0.0

    tx = Transaction(
        user_id=payload.user_id,
        merchant=payload.merchant,
        amount=payload.amount,
        device_id=payload.device_id,
        ip_address=payload.ip_address,
        location=payload.location,
        avg_user_spend=avg_spend,
        timestamp=datetime.utcnow()
    )

    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.get("/all", response_model=list[TransactionOut])
def get_all_transactions(
    db: Session = Depends(get_db),
    admin=Depends(admin_only)
):
    return db.query(Transaction).order_by(Transaction.timestamp.desc()).all()
