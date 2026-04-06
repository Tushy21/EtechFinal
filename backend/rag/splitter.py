from langchain.text_splitter import RecursiveCharacterTextSplitter

def split_text_into_chunks(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> list[str]:
    """
    Splits a large text string into smaller chunks using Langchain's RecursiveCharacterTextSplitter.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks
