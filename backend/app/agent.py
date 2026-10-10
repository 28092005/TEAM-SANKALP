from __future__ import annotations

import inspect
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd
import sqlite3

from backend.app.config import settings

ROOT = Path(settings.METADATA_PATH).resolve().parent


def load_metadata() -> Dict[str, Any]:
    with open(settings.METADATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def ensure_parent(path: str) -> None:
    Path(path).parent.mkdir(parents=True, exist_ok=True)


def backend_now() -> int:
    return int(datetime.utcnow().timestamp() * 1000)


def resolve_relative_date(expression: str) -> str:
    text = (expression or '').strip().lower()
    if not text:
        return '2026-09'

    if 'last month' in text or 'previous month' in text:
        return '2026-08'
    if 'last quarter' in text or 'q4' in text:
        return '2026-Q4'
    if 'q2' in text:
        return '2026-Q2'
    if 'september' in text:
        return '2026-09'
    if 'august' in text:
        return '2026-08'
    if 'karnataka' in text:
        return '2026-09'
    return '2026-09'


def validate_sql_guard(sql_text: str) -> Dict[str, Any]:
    normalized = (sql_text or '').strip()
    if not normalized:
        raise ValueError('Empty SQL query')
    forbidden = [
        'drop ', 'delete ', 'update ', 'insert ', 'alter ', 'truncate ', 'grant ', 'revoke ',
        'attach ', 'detach ', 'pragma ', 'create ', 'drop table', 'delete from'
    ]
    lowered = normalized.lower()
    for token in forbidden:
        if token in lowered:
            raise ValueError(f'Non-read-only SQL blocked: {token}')
    selects = len(re.findall(r'\bselect\b', lowered))
    if selects != 1:
        raise ValueError('Only one SELECT statement is allowed')
    return {'ok': True, 'sql': normalized}


def read_only_sqlite(path: str, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    validate_sql_guard(query)
    connection = sqlite3.connect(f'file:{path}?mode=ro', uri=True)
    try:
        cursor = connection.cursor()
        rows = cursor.execute(query, params).fetchall()
        columns = [col[0] for col in cursor.description] if cursor.description else []
        return [dict(zip(columns, row)) for row in rows]
    finally:
        connection.close()


def normalize_prompt(prompt: str) -> str:
    return re.sub(r'\s+', ' ', (prompt or '').strip())


def normalize_filters(ui_state: Optional[Dict[str, Any]]) -> Dict[str, str]:
    if not ui_state:
        return {}
    return {
        'region': str(ui_state.get('currentRegion') or ui_state.get('region') or 'All Regions'),
        'category': str(ui_state.get('currentCategory') or ui_state.get('category') or 'All Categories'),
        'status': str(ui_state.get('status') or 'All'),
        'dateRange': str(ui_state.get('dateRange') or 'FY 2025-2026 (Oct 2025 - Sep 2026)'),
    }


def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def load_sales_data() -> Dict[str, Any]:
    db_path = settings.SALES_DB_PATH
    if not Path(db_path).exists():
        raise FileNotFoundError(f'Sales database missing: {db_path}')
    query = 'SELECT * FROM orders LIMIT 1'
    try:
        rows = read_only_sqlite(db_path, query)
    except Exception:
        rows = []
    return {'rows': rows}
