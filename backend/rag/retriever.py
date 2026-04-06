import os
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from rag.embeddings import get_embeddings_model

FAISS_INDEX_PATH = ".faiss_index"

def store_chunks_in_faiss(chunks: list[str]) -> bool:
    """
    Converts text chunks into embeddings and stores them in a local FAISS vector DB.
    Recreates the DB if it already exists for the singular PDF context of this simple app.
    """
    embeddings_model = get_embeddings_model()
    documents = [Document(page_content=chunk) for chunk in chunks]
    
    # Create the FAISS vector store from the documents
    vectorstore = FAISS.from_documents(documents, embeddings_model)
    
    # Save locally
    vectorstore.save_local(FAISS_INDEX_PATH)
    return True

def retrieve_top_k_chunks(query: str, k: int = 4) -> list[str]:
    """
    Retrieves the top k most similar chunks to the query from the local FAISS DB.
    """
    if not os.path.exists(FAISS_INDEX_PATH):
        # Return empty if DB hasn't been created yet
        return []
    
    embeddings_model = get_embeddings_model()
    # Load vector store (allow_dangerous_deserialization=True is typical for trusted local FAISS indices)
    vectorstore = FAISS.load_local(FAISS_INDEX_PATH, embeddings_model, allow_dangerous_deserialization=True)
    
    retriever = vectorstore.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(query)
    
    return [doc.page_content for doc in docs]
