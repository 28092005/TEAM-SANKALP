# TEAM-SANKALP

This repository contains the React/Vite enterprise BI dashboard and a FastAPI backend scaffold for the same business flows.

## Frontend

```bash
npm install
npm run dev
```

## Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
python backend/seed_sales_db.py
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

## API checks

- GET /api/health
- GET /api/metadata
- GET /api/data/{page_id}
- POST /api/agent/chat
- POST /api/agent/confirm

## Environment

Copy `.env.example` to `.env` and add any required secrets. Do not commit real credentials.
