import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from rag.loader import extract_text_from_pdf
from rag.splitter import split_text_into_chunks
from rag.retriever import store_chunks_in_faiss, retrieve_top_k_chunks
from rag.llm import generate_answer
from services.chat_history import get_history, add_message, clear_history

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        # Read file bytes
        contents = await file.read()
        
        # 1. Extract text from PDF
        text = extract_text_from_pdf(contents)
        logger.info(f"Extracted {len(text)} characters from PDF")
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF. It might be empty or scanned.")
            
        # 2. Split into chunks
        chunks = split_text_into_chunks(text)
        logger.info(f"Split into {len(chunks)} chunks")
        
        # 3. Store in FAISS
        store_chunks_in_faiss(chunks)
        logger.info("Stored chunks in FAISS vector DB")
        
        # Clear previous chat history if a new document is uploaded
        clear_history()
        
        return {"message": f"Successfully uploaded, processed, and indexed {file.filename}. ({len(chunks)} chunks created)"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def query_pdf(request: QueryRequest):
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
    try:
        # 1. Add user query to history
        add_message("user", request.question)
        
        # 2. Retrieve top-k relevant chunks
        retrieved_chunks = retrieve_top_k_chunks(request.question, k=4)
        logger.info(f"Retrieved {len(retrieved_chunks)} chunks for query: '{request.question}'")
        for i, chunk in enumerate(retrieved_chunks):
            logger.info(f"Chunk {i+1} preview: {chunk[:100]}...")
        
        # 3. Generate Answer
        if not retrieved_chunks:
            answer = "I don't know. (No relevant context found — did you upload a PDF first?)"
        else:
            answer = generate_answer(request.question, retrieved_chunks)
        logger.info(f"Answer generated: {answer[:100]}")
        
        # 4. Add answer to history
        add_message("assistant", answer)
        
        return {"answer": answer}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_chat_history():
    return {"history": get_history()}
