# Chat with Your PDF

A full-stack RAG (Retrieval-Augmented Generation) application allowing users to upload a PDF document and chat with its content using an LLM.

## Tech Stack
* Frontend: React + Vite + TailwindCSS
* Backend: FastAPI (Python)
* AI/RAG: Langchain, OpenAI (LLM & Embeddings), FAISS (Vector DB)
* Parsing: PyPDF

## Running the Application

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create a `.env` file in the `backend/` directory and add: `OPENAI_API_KEY=your_openai_api_key_here`
4. Run server: `uvicorn main:app --reload` (Runs on http://localhost:8000)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Run app: `npm run dev` (Usually runs on http://localhost:5173)

## Features
- Upload PDF, chunk texts, store embeddings in FAISS locally.
- Chat UI to interact natively with your PDF.
