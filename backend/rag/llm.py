import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

# The strict prompt requested
RAG_PROMPT_TEMPLATE = """Answer the question based only on the context below. If the answer is not present, say 'I don't know'.

Context:
{retrieved_chunks}

Question:
{user_query}

Answer:"""

def generate_answer(query: str, retrieved_chunks: list[str]) -> str:
    """
    Passes the retrieved chunks as context and user query to the LLM to generate an answer.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "Error: OPENAI_API_KEY is missing."

    # Join the chunks into a single string for context
    context_text = "\n\n".join(retrieved_chunks)
    
    # Initialize the LLM (gpt-4o-mini is efficient and cost-effective, or use gpt-3.5-turbo)
    llm = ChatOpenAI(model="gpt-4o-mini", openai_api_key=api_key, temperature=0.1)
    
    prompt = ChatPromptTemplate.from_template(RAG_PROMPT_TEMPLATE)
    
    # Simple LangChain Runnable chain
    chain = prompt | llm | StrOutputParser()
    
    # Invoke the chain
    answer = chain.invoke({
        "retrieved_chunks": context_text,
        "user_query": query
    })
    
    return answer
