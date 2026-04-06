from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
# from rag.pipeline import process_pdf, answer_query
# from services.chat_history import get_history, add_message

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Save file and trigger RAG pipeline processing
    # TODO: implement PDF processing
    return {"message": f"Successfully uploaded and processed {file.filename}"}

@router.post("/query")
async def query_pdf(request: QueryRequest):
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
    # TODO: implement RAG retrieval and answer generation
    answer = f"Echo: {request.question}"
    
    # TODO: store in history
    return {"answer": answer}

@router.get("/history")
async def get_chat_history():
    # TODO: retrieve history
    return {"history": []}
