from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin
from app.db.models import Transaction
from app.explainability.rag import build_context
from app.explainability.llm import generate_explanation

router = APIRouter()


@router.get("/transaction/{transaction_id}")
def explain_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    """
    Returns human-readable explanation for a flagged transaction.
    Only admin can access explainability.
    """

    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Build RAG-safe context (NO PII leakage)
    context = build_context(tx)

    explanation = generate_explanation(context)

    return {
        "transaction_id": tx.id,
        "risk_score": tx.risk_score,
        "decision": tx.decision,
        "explanation": explanation
    }
