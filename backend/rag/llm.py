from transformers import pipeline
from langchain_community.llms import HuggingFacePipeline
from langchain_core.prompts import PromptTemplate

# Cached pipeline
_llm = None

RAG_PROMPT_TEMPLATE = """Answer the question based only on the context below. If the answer is not present, say 'I don't know'.

Context:
{retrieved_chunks}

Question:
{user_query}

Answer:"""

def get_llm():
    global _llm
    if _llm is None:
        # flan-t5-base: ~250MB, runs fully locally on CPU, no API key needed
        pipe = pipeline(
            "text2text-generation",
            model="google/flan-t5-base",
            max_new_tokens=512,
            temperature=0.1,
            do_sample=False,
        )
        _llm = HuggingFacePipeline(pipeline=pipe)
    return _llm

def generate_answer(query: str, retrieved_chunks: list[str]) -> str:
    """
    Passes the retrieved chunks as context and user query to the local LLM to generate an answer.
    """
    context_text = "\n\n".join(retrieved_chunks)

    prompt = RAG_PROMPT_TEMPLATE.format(
        retrieved_chunks=context_text,
        user_query=query
    )

    llm = get_llm()
    answer = llm.invoke(prompt)
    return answer.strip() if answer else "I don't know."
