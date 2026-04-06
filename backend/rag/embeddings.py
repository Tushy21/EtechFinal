import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()

def get_embeddings_model():
    """
    Returns an instance of OpenAIEmbeddings.
    Assumes OPENAI_API_KEY is set in the environment or .env file.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is missing from environment variables.")
    
    return OpenAIEmbeddings(openai_api_key=api_key)
