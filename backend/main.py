"""
main.py — The Zad backend server

HOW TO RUN:
  uvicorn main:app --reload --port 8000

ENDPOINTS:
  POST   /chat           → Send a question, get an AI answer
  POST   /ingest/url     → Add a webpage to the knowledge base
  POST   /ingest/pdf     → Upload a PDF to the knowledge base
  GET    /sources        → List all sources (used by both Sources page and Admin)
  DELETE /sources        → Remove a source
  GET    /health         → Check the server is running
"""

import os
import tempfile
from typing import Optional

import groq
from groq import Groq
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingest import scrape_website, ingest_pdf
from rag import add_to_knowledge_base, search_knowledge_base, get_knowledge_base_stats, delete_source

load_dotenv()

app = FastAPI(title="Zad Islamic Knowledge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPT = """You are Zad (زاد), a respectful and knowledgeable Islamic assistant.
The name Zad means "provision" — you provide the knowledge Muslims need for their journey.

YOUR STRICT RULES:
1. Answer ONLY using the CONTEXT provided below each question.
2. If the context does not contain a clear answer, respond with:
   "I was not able to find a clear answer to this in my trusted sources. I recommend consulting a qualified Islamic scholar."
3. NEVER draw on outside knowledge. Only use what is in the provided context.
4. Always mention which source your answer comes from.
5. For fiqh matters, note different scholarly opinions if the context mentions them.
6. Be respectful, clear, and compassionate.
7. When referencing Quran or Hadith, mention the reference (Surah/verse or collection/number).
8. Do not issue personal fatwas. Present what the trusted sources say.

FORMAT:
- Give a clear, direct answer
- Cite your source at the end: "📚 Source: [source name]"
- If uncertain, say so honestly"""


# ── Models ─────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[list[dict]] = []

class ChatResponse(BaseModel):
    answer: str
    sources_used: list[dict]
    found_in_sources: bool

class IngestURLRequest(BaseModel):
    url: str
    source_name: str
    source_name_ar: Optional[str] = ""
    category: Optional[str] = "other"
    description: Optional[str] = ""

class DeleteSourceRequest(BaseModel):
    source_name: str


# ── Endpoints ──────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model": GROQ_MODEL}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    chunks = search_knowledge_base(request.message)

    if not chunks:
        return ChatResponse(
            answer="I was not able to find relevant information in my trusted Islamic sources for this question. I recommend consulting a qualified Islamic scholar.",
            sources_used=[],
            found_in_sources=False
        )

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(f"[Source {i}: {chunk['source_name']}]\n{chunk['text']}")
    context = "\n\n---\n\n".join(context_parts)

    user_message = f"""CONTEXT FROM TRUSTED ISLAMIC SOURCES:
{context}

---

USER QUESTION: {request.message}

Remember: Answer ONLY based on the context above."""

    messages = []
    for turn in request.conversation_history[-6:]:
        messages.append(turn)
    messages.append({"role": "user", "content": user_message})

    try:
        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            max_tokens=1024,
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + messages
        )
        answer = response.choices[0].message.content
    except groq.APIError as e:
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    return ChatResponse(
        answer=answer,
        sources_used=[
            {
                "source_name":    c["source_name"],
                "source_name_ar": c.get("source_name_ar", ""),
                "source_url":     c["source_url"],
                "category":       c.get("category", "other"),
                "similarity":     c["similarity"]
            }
            for c in chunks
        ],
        found_in_sources=True
    )


@app.post("/ingest/url")
async def ingest_url(request: IngestURLRequest):
    """Scrape a webpage and add it to the knowledge base."""
    if not request.url.startswith("http"):
        raise HTTPException(status_code=400, detail="URL must start with http or https")

    text = scrape_website(request.url)
    if not text:
        raise HTTPException(status_code=422, detail="Could not extract text from that URL.")

    chunks_added = add_to_knowledge_base(
        text=text,
        source_name=request.source_name,
        source_url=request.url,
        source_name_ar=request.source_name_ar or "",
        category=request.category or "other",
        description=request.description or ""
    )

    return {
        "status": "success",
        "source_name": request.source_name,
        "url": request.url,
        "chunks_added": chunks_added,
        "words_extracted": len(text.split())
    }


@app.post("/ingest/pdf")
async def ingest_pdf_endpoint(
    file: UploadFile = File(...),
    source_name: str = Form(...),
    source_name_ar: str = Form(""),
    category: str = Form("other"),
    description: str = Form("")
):
    """Upload a PDF and add it to the knowledge base."""
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        from ingest import read_pdf
        text = read_pdf(tmp_path)
        chunks_added = add_to_knowledge_base(
            text=text,
            source_name=source_name,
            source_url="",           # PDFs have no URL
            source_name_ar=source_name_ar,
            category=category,
            description=description
        )
    finally:
        os.unlink(tmp_path)

    if chunks_added == 0:
        raise HTTPException(status_code=422, detail="Could not extract text from this PDF.")

    return {
        "status": "success",
        "source_name": source_name,
        "filename": file.filename,
        "chunks_added": chunks_added
    }


@app.get("/sources")
def list_sources():
    """
    Returns all sources with full metadata.
    Used by BOTH the public Sources page and the Admin Dashboard.
    """
    return get_knowledge_base_stats()


@app.delete("/sources")
def remove_source(request: DeleteSourceRequest):
    deleted = delete_source(request.source_name)
    if deleted == 0:
        raise HTTPException(status_code=404, detail=f"Source '{request.source_name}' not found")
    return {"status": "success", "source_name": request.source_name, "chunks_deleted": deleted}
