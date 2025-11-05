(The file `/Users/williamragnarsson/Documents/Programming/DataForGoodChallenge/backend/README.md` exists, but is empty)
# Backend — Quick start

Short instructions to clone, set up a Python virtual environment, install dependencies, and run the backend.

Prerequisites
- Python 3.10+ (or 3.8+) installed

Clone

```bash
git clone <repo-url>
cd DataForGoodChallenge/backend
```

Setup (venv)

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
# if a requirements.txt exists
pip install -r requirements.txt
```

Run

If `main.py` contains a runnable script, start it with:

```bash
python main.py
```

If the backend is a FastAPI/ASGI app, run with Uvicorn instead:

```bash
uvicorn main:app --reload --port 8000
```

Environment
- Put local secrets in `backend/.env` or export environment variables before running.

Testing

```bash
# run tests if present
pytest
```

Notes
- This README is intentionally concise. If you want, I can expand with exact dependencies, env var names, or move backend-specific ignores into `backend/.gitignore`.

