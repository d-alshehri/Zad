"""
ingest.py — Add content to your knowledge base

Run this from the command line to add Islamic sources:

  # Add a webpage:
  python ingest.py --url "https://sunnah.com/bukhari/1" --name "Sunnah.com"

  # Add a PDF book:
  python ingest.py --pdf "../data/pdfs/your-book.pdf" --name "Book Name"

  # See what's in your knowledge base:
  python ingest.py --stats

  # Remove a source:
  python ingest.py --delete "Sunnah.com"
"""

import argparse
import re
import time

import fitz  # PyMuPDF — reads PDFs
import requests
from bs4 import BeautifulSoup

from rag import add_to_knowledge_base, get_knowledge_base_stats, delete_source


def scrape_website(url: str) -> str:
    """
    Download a webpage and extract clean text.
    Removes navigation, scripts, footers — just the actual content.
    """
    print(f"🌐 Scraping: {url}")

    headers = {"User-Agent": "Mozilla/5.0 (compatible; ZadBot/1.0; Islamic Knowledge Base)"}

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Failed to fetch {url}: {e}")
        return ""

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove non-content elements
    for tag in soup(["nav", "header", "footer", "script", "style", "aside", "iframe", "form"]):
        tag.decompose()

    text = soup.get_text(separator=" ", strip=True)
    text = re.sub(r'\s+', ' ', text).strip()

    print(f"   → Extracted {len(text.split())} words")
    return text


def read_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF file using PyMuPDF."""
    print(f"📄 Reading PDF: {pdf_path}")

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"❌ Failed to open PDF: {e}")
        return ""

    pages_text = []
    for page in doc:
        text = page.get_text()
        if text.strip():
            pages_text.append(text)
    doc.close()

    combined = re.sub(r'\s+', ' ', " ".join(pages_text)).strip()
    print(f"   → Extracted {len(combined.split())} words")
    return combined


def ingest_pdf(pdf_path: str, source_name: str, source_url: str = "") -> int:
    text = read_pdf(pdf_path)
    if not text:
        return 0
    return add_to_knowledge_base(text, source_name, source_url)


# ── CLI ────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Manage the Zad Islamic knowledge base")
    parser.add_argument("--url",    help="URL of a webpage to scrape and add")
    parser.add_argument("--name",   help="Name for this source (e.g. 'Sunnah.com')")
    parser.add_argument("--pdf",    help="Path to a PDF file to add")
    parser.add_argument("--stats",  action="store_true", help="Show knowledge base stats")
    parser.add_argument("--delete", help="Delete all chunks from a source by name")
    args = parser.parse_args()

    if args.stats:
        stats = get_knowledge_base_stats()
        print(f"\n📚 Knowledge Base — {stats['total_chunks']} total chunks")
        if stats["sources"]:
            for s in stats["sources"]:
                print(f"   • {s['name']}: {s['chunks']} chunks")
        else:
            print("   (empty — add content with --url or --pdf)")

    elif args.delete:
        delete_source(args.delete)

    elif args.url:
        if not args.name:
            print("❌ Please also provide --name")
        else:
            text = scrape_website(args.url)
            if text:
                add_to_knowledge_base(text, args.name, args.url)

    elif args.pdf:
        if not args.name:
            print("❌ Please also provide --name")
        else:
            ingest_pdf(args.pdf, args.name)

    else:
        parser.print_help()
