# Chat with Your PDF (RAG Application)

A full-stack RAG (Retrieval-Augmented Generation) application allowing users to upload a PDF document and chat with its content using an LLM. This handles vector embeddings, document chunking, and similarity-based context ingestion effectively.

## Built With
* **Frontend**: React, Vite, TailwindCSS, Lucide React
* **Backend**: FastAPI (Python), Uvicorn
* **AI/RAG Pipelines**: Langchain, OpenAI (`gpt-4o-mini`, `text-embedding-ada-002`), FAISS (CPU Vector DB)
* **Parsing Tools**: PyPDF

## Running the Application Locally

### Requirements
- Python 3.9+
- Node.js 18+
- An OpenAI API Key

### Backend Setup
1. `cd backend`
2. Create and activate a virtual environment: `python3 -m venv venv && source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file in the `backend/` directory and add: `OPENAI_API_KEY=your_openai_api_key_here`
5. Run the background server: `uvicorn main:app --reload` (Runs on http://localhost:8000)

### Frontend Setup
1. `cd frontend`
2. Install package elements: `npm install`
3. Start the dev server: `npm run dev` (Runs on http://localhost:5173)

## Features Included
- Clean, modern, prompt-focused UI inspired by ChatGPT.
- RAG pipeline ensuring the application only answers based strictly on the PDF provided.
- Local vector database caching for the uploaded document.
- Fully typed endpoints and conversational memory structure built in.
