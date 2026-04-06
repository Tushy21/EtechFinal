from langchain_community.embeddings import HuggingFaceEmbeddings

# Cached model instance so we only load it once
_embeddings_model = None

def get_embeddings_model():
    """
    Returns a locally-running HuggingFace sentence-transformers embeddings model.
    Model: all-MiniLM-L6-v2 — fast, small, and high quality.
    No API key required.
    """
    global _embeddings_model
    if _embeddings_model is None:
        _embeddings_model = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
    return _embeddings_model
