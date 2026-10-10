from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.app.agent import BackendAgent
from backend.app.config import settings
from backend.app.data import load_metadata, normalize_filters, read_only_sqlite, resolve_relative_date, validate_sql_guard

app = FastAPI(title=settings.APP_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

agent = BackendAgent()


class ChatRequest(BaseModel):
    message: str
    ui_state: Optional[Dict[str, Any]] = None


class ConfirmRequest(BaseModel):
    message_id: Optional[str] = None
    accepted: bool = True


@app.get('/api/health')
def health() -> Dict[str, Any]:
    return {'status': 'ok', 'service': settings.APP_NAME, 'backend': 'fastapi'}


@app.get('/api/metadata')
def metadata() -> Dict[str, Any]:
    return load_metadata()


@app.get('/api/data/{page_id}')
def get_data(page_id: str, filters: Optional[str] = None) -> Dict[str, Any]:
    db_path = settings.SALES_DB_PATH
    if not Path(db_path).exists():
        raise HTTPException(status_code=500, detail='Sales database not initialized')

    page_name = page_id
    payload: Dict[str, Any] = {'page_id': page_id, 'page_name': page_name, 'filters': {}, 'data': {'orders': [], 'products': [], 'customers': [], 'regions': [], 'monthlyTrend': []}}

    sql = 'SELECT * FROM orders LIMIT 50'
    payload['data']['orders'] = read_only_sqlite(db_path, sql)
    payload['data']['products'] = read_only_sqlite(db_path, 'SELECT * FROM products LIMIT 20')
    payload['data']['customers'] = read_only_sqlite(db_path, 'SELECT * FROM customers LIMIT 20')
    payload['data']['regions'] = read_only_sqlite(db_path, 'SELECT * FROM regional_metrics LIMIT 20')
    payload['data']['monthlyTrend'] = read_only_sqlite(db_path, 'SELECT * FROM monthly_trend LIMIT 20')
    payload['filters'] = normalize_filters(json.loads(filters) if filters else {})
    return payload


@app.post('/api/agent/chat')
def chat(request: ChatRequest) -> Dict[str, Any]:
    result = agent.build_response(request.message, request.ui_state or {})
    return result


@app.post('/api/agent/confirm')
def confirm(request: ConfirmRequest) -> Dict[str, Any]:
    return {'ok': True, 'message_id': request.message_id, 'accepted': request.accepted, 'status': 'confirmed'}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('backend.app.main:app', host=settings.API_HOST, port=settings.API_PORT, reload=False)
