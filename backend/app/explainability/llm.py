import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"


def generate_explanation(context: dict) -> str:
    """
    Uses local Ollama LLM to convert structured fraud context
    into human-readable explanation.
    """

    prompt = f"""
You are a fraud risk analyst assistant.

Explain in simple, professional language why the following
transaction was flagged.

Rules:
- Do NOT mention IP addresses or device IDs
- Do NOT invent new facts
- Use only the provided context
- Keep explanation under 4 sentences

Context:
{json.dumps(context, indent=2)}
"""

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=10)
        response.raise_for_status()
        return response.json().get("response", "No explanation generated.")
    except Exception as e:
        # Safe fallback (system never breaks)
        return "Explanation unavailable. Please review transaction details manually."
