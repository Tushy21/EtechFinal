import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

RAG_PROMPT_TEMPLATE = """Answer the question based only on the context below. If the answer is not present in the context, say 'I don't know'.

Context:
{retrieved_chunks}

Question:
{user_query}

Answer:"""

# Cached LLM instance
_llm = None

def get_llm():
    global _llm
    if _llm is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is missing. Get a free key at https://console.groq.com")
        _llm = ChatGroq(
            model="llama-3.1-8b-instant",
            groq_api_key=api_key,
            temperature=0.1,
        )
    return _llm

def generate_answer(query: str, retrieved_chunks: list[str]) -> str:
    """
    Passes the retrieved chunks as context and user query to Groq LLaMA 3 to generate an answer.
    Groq is free to use with a free account at console.groq.com
    """
    context_text = "\n\n".join(retrieved_chunks)

    prompt = ChatPromptTemplate.from_template(RAG_PROMPT_TEMPLATE)
    chain = prompt | get_llm() | StrOutputParser()

    answer = chain.invoke({
        "retrieved_chunks": context_text,
        "user_query": query
    })

    return answer.strip() if answer else "I don't know."
