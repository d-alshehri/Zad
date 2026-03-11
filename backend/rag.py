"""
rag.py — The knowledge base engine

Stores text chunks + metadata (name, Arabic name, category, URL) in ChromaDB.
Retrieves the most relevant chunks when a user asks a question.
"""

import os
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH", "../data/chroma_db")
COLLECTION_NAME = "zad_knowledge"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K = int(os.getenv("RAG_TOP_K", 5))

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

collection = chroma_client.get_or_create_collection(
    name=COLLECTION_NAME,
    embedding_function=embedding_fn,
    metadata={"hnsw:space": "cosine"}
)


def chunk_text(text: str, source_name: str, source_url: str = "") -> list[dict]:
    words = text.split()
    chunks = []
    start = 0
    chunk_index = 0
    while start < len(words):
        end = start + CHUNK_SIZE
        chunks.append({
            "text": " ".join(words[start:end]),
            "source_name": source_name,
            "source_url": source_url,
            "chunk_index": chunk_index,
            "id": f"{source_name.replace(' ', '_')}__chunk_{chunk_index}"
        })
        start += CHUNK_SIZE - CHUNK_OVERLAP
        chunk_index += 1
    return chunks


def add_to_knowledge_base(
    text: str,
    source_name: str,
    source_url: str = "",
    source_name_ar: str = "",
    category: str = "other",
    description: str = ""
) -> int:
    """
    Add text to the knowledge base with full metadata.

    source_name    : English name  e.g. "Sahih al-Bukhari"
    source_url     : original URL, or empty string for PDFs
    source_name_ar : Arabic name   e.g. "صحيح البخاري"
    category       : quran | hadith | tafsir | fatwa | other
    description    : short description shown on the Sources page
    """
    chunks = chunk_text(text, source_name, source_url)
    if not chunks:
        return 0

    collection.upsert(
        ids=[c["id"] for c in chunks],
        documents=[c["text"] for c in chunks],
        metadatas=[{
            "source_name":    c["source_name"],
            "source_url":     c["source_url"],
            "source_name_ar": source_name_ar,
            "category":       category,
            "description":    description,
            "chunk_index":    c["chunk_index"]
        } for c in chunks]
    )
    print(f"✅ Added {len(chunks)} chunks from '{source_name}'")
    return len(chunks)


def search_knowledge_base(query: str, top_k: int = TOP_K) -> list[dict]:
    total_docs = collection.count()
    if total_docs == 0:
        return []
    k = min(top_k, total_docs)
    results = collection.query(
        query_texts=[query],
        n_results=k,
        include=["documents", "metadatas", "distances"]
    )
    chunks = []
    for i in range(len(results["documents"][0])):
        distance = results["distances"][0][i]
        meta = results["metadatas"][0][i]
        chunks.append({
            "text":           results["documents"][0][i],
            "source_name":    meta["source_name"],
            "source_url":     meta.get("source_url", ""),
            "source_name_ar": meta.get("source_name_ar", ""),
            "category":       meta.get("category", "other"),
            "similarity":     round(1 - (distance / 2), 3)
        })
    return chunks


def get_knowledge_base_stats() -> dict:
    """
    Returns all sources with full metadata.
    Used by both the Sources page and Admin Dashboard.
    """
    total = collection.count()
    if total == 0:
        return {"total_chunks": 0, "sources": []}

    all_items = collection.get(include=["metadatas"])
    source_map: dict[str, dict] = {}
    for meta in all_items["metadatas"]:
        name = meta["source_name"]
        if name not in source_map:
            source_map[name] = {
                "name":        name,
                "name_ar":     meta.get("source_name_ar", ""),
                "category":    meta.get("category", "other"),
                "url":         meta.get("source_url", ""),
                "description": meta.get("description", ""),
                "chunks":      0
            }
        source_map[name]["chunks"] += 1

    return {
        "total_chunks": total,
        "sources": sorted(source_map.values(), key=lambda s: s["name"])
    }


def delete_source(source_name: str) -> int:
    results = collection.get(
        where={"source_name": source_name},
        include=["metadatas"]
    )
    if not results["ids"]:
        return 0
    collection.delete(ids=results["ids"])
    print(f"🗑️  Deleted {len(results['ids'])} chunks from '{source_name}'")
    return len(results["ids"])
