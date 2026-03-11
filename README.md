# Zad زاد — Full Setup Guide

You have two parts:
- **backend/** — the Python server (you build this)
- **your Lovable frontend** — the React app (you already have this)

---

## Step 1 — Set up the backend

### Install Python
Make sure you have Python 3.10 or newer.
Check: `python --version`

### Create a virtual environment
```bash
cd backend
python -m venv venv

# Mac / Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### Install dependencies
```bash
pip install -r requirements.txt
```
This will take a few minutes. It downloads:
- FastAPI (the web server)
- ChromaDB (your vector database)
- Sentence Transformers (converts text to embeddings — ~90MB, downloaded once)
- PyMuPDF (reads PDFs)
- Anthropic SDK (talks to Claude)

### Create your .env file
```bash
cp .env.example .env
```
Open `.env` and fill in:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here   ← from console.anthropic.com
ADMIN_PASSWORD=pick-a-strong-password
```

### Start the backend server
```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO: Uvicorn running on http://127.0.0.1:8000
```

✅ Your backend is running.

---

## Step 2 — Set up the frontend changes

### Copy the new files into your Zad project

From the `frontend-changes/` folder, copy:

```
frontend-changes/src/services/api.ts       → your-zad-project/src/services/api.ts
frontend-changes/src/pages/Chat.tsx        → your-zad-project/src/pages/Chat.tsx
frontend-changes/src/pages/Admin.tsx       → your-zad-project/src/pages/Admin.tsx
frontend-changes/src/pages/AdminDashboard.tsx → your-zad-project/src/pages/AdminDashboard.tsx
```

Note: `src/services/` is a new folder — create it if it doesn't exist.

### Create your frontend .env file
In the root of your Zad frontend project, create a `.env` file:
```
VITE_API_URL=http://localhost:8000
VITE_ADMIN_PASSWORD=same-password-as-backend
```

### Start the frontend
```bash
npm run dev
```

---

## Step 3 — Add your first Islamic source

Open your browser and go to the Zad app.
Click the ⚙ settings icon → Admin → enter your password → Add URL

Or use the command line:
```bash
cd backend
python ingest.py --url "https://sunnah.com/bukhari/1" --name "Sunnah.com"
```

---

## Step 4 — Test it

Ask a question in the chat. The answer will come from your added sources only.
You'll see the source cited below every AI response.

---

## Project structure explained

```
zad-project/
│
├── backend/
│   ├── main.py        ← The web server. Handles API requests.
│   ├── rag.py         ← Stores and searches your Islamic knowledge.
│   ├── ingest.py      ← Adds websites and PDFs to the knowledge base.
│   ├── requirements.txt
│   └── .env           ← Your secrets (API key, password). Never share this.
│
├── data/
│   ├── chroma_db/     ← Your vector database lives here (auto-created).
│   └── pdfs/          ← Drop PDF books here before ingesting.
│
└── frontend-changes/  ← Drop these files into your Lovable project.
    ├── src/
    │   ├── services/api.ts         ← All API calls in one place.
    │   └── pages/
    │       ├── Chat.tsx            ← Real AI chat (was mock).
    │       ├── Admin.tsx           ← Real password check.
    │       └── AdminDashboard.tsx  ← Real source management.
    └── .env.example
```

---

## Suggested sources to add

| What to add | Source name to use |
|---|---|
| https://sunnah.com/bukhari/1 | Sunnah.com — Bukhari |
| https://sunnah.com/muslim/1 | Sunnah.com — Muslim |
| https://quran.com/al-baqarah | Quran.com — Al-Baqarah |
| https://islamqa.info/en/answers/... | IslamQA |
| Any PDF Islamic book | Book title + author |

---

## Troubleshooting

**"Cannot connect to backend"**
→ Start the backend: `uvicorn main:app --reload --port 8000`

**"Knowledge base is empty"**
→ Add sources via the Admin Dashboard or CLI

**Slow first startup**
→ The embedding model downloads on first run. Normal, happens once.

**PDF text is garbled / Arabic not reading correctly**
→ Make sure the PDF has actual text (not a scanned image). Text PDFs work best.
