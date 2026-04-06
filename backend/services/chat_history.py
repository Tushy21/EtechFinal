from typing import List

# Simple in-memory storage for the chat history
# Format: list of dicts: {"role": "user" | "assistant", "content": "..."}
chat_history: List[dict] = []

def get_history() -> List[dict]:
    """Retrieve chat history."""
    return chat_history

def add_message(role: str, content: str):
    """Add a message to the chat history."""
    chat_history.append({"role": role, "content": content})

def clear_history():
    """Clear chat history (useful on new PDF upload)."""
    global chat_history
    chat_history.clear()
