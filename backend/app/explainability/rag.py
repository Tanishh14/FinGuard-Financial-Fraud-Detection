"""
RAG Context Builder
-------------------
Responsible for preparing sanitized, structured context
for LLM explainability.

⚠️ No PII (email, IP, exact device ID) is exposed.
"""

from app.db.models import Transaction


def build_context(tx: Transaction) -> dict:
    """
    Converts a Transaction ORM object into
    LLM-safe structured reasoning context.
    """

    context = {
        "transaction_features": {
            "amount": tx.amount,
            "merchant": tx.merchant,
            "location": tx.location,
            "timestamp": tx.timestamp.isoformat(),
        },
        "behavioral_features": {
            "average_user_spend": tx.avg_user_spend,
            "amount_deviation_ratio": (
                round(tx.amount / tx.avg_user_spend, 2)
                if tx.avg_user_spend and tx.avg_user_spend > 0
                else None
            ),
        },
        "model_outputs": {
            "risk_score": tx.risk_score,
            "decision": tx.decision
        }
    }

    return context
