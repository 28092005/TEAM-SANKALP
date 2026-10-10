from __future__ import annotations

import json
import re
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from backend.app.config import settings


def load_metadata() -> Dict[str, Any]:
    with open(settings.METADATA_PATH, 'r', encoding='utf-8') as fh:
        return json.load(fh)


def ensure_parent(path: str) -> None:
    Path(path).parent.mkdir(parents=True, exist_ok=True)


def normalize_prompt(prompt: str) -> str:
    return re.sub(r'\s+', ' ', (prompt or '').strip())


def resolve_relative_date(expression: str) -> str:
    value = normalize_prompt(expression).lower()
    if not value:
        return '2026-09'
    if 'last month' in value or 'previous month' in value:
        return '2026-08'
    if 'q2' in value:
        return '2026-Q2'
    if 'last quarter' in value or 'q4' in value:
        return '2026-Q4'
    if 'september' in value:
        return '2026-09'
    if 'august' in value:
        return '2026-08'
    if 'july' in value:
        return '2026-07'
    return '2026-09'


def validate_sql_guard(sql_text: str) -> Dict[str, Any]:
    normalized = (sql_text or '').strip()
    if not normalized:
        raise ValueError('Empty SQL query')
    lower = normalized.lower()
    forbidden = [
        'drop ', 'delete ', 'update ', 'insert ', 'alter ', 'truncate ', 'grant ', 'revoke ',
        'attach ', 'detach ', 'pragma ', 'create ', 'drop table', 'delete from',
        'executemany', 'replace into', 'schema'
    ]
    for token in forbidden:
        if token in lower:
            raise ValueError(f'Non-read-only SQL blocked: {token}')
    if lower.count('select') != 1:
        raise ValueError('Only one SELECT statement is allowed')
    return {'ok': True, 'sql': normalized}


def read_only_sqlite(db_path: str, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    validate_sql_guard(query)
    connection = sqlite3.connect(f'file:{db_path}?mode=ro', uri=True)
    try:
        cursor = connection.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description] if cursor.description else []
        return [dict(zip(columns, row)) for row in rows]
    finally:
        connection.close()


def normalize_filters(ui_state: Optional[Dict[str, Any]]) -> Dict[str, str]:
    if not ui_state:
        return {}
    return {
        'region': str(ui_state.get('currentRegion') or ui_state.get('region') or 'All Regions'),
        'category': str(ui_state.get('currentCategory') or ui_state.get('category') or 'All Categories'),
        'status': str(ui_state.get('status') or 'All'),
        'dateRange': str(ui_state.get('dateRange') or 'FY 2025-2026 (Oct 2025 - Sep 2026)'),
    }


def backend_now_ms() -> int:
    return int(datetime.utcnow().timestamp() * 1000)


def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default
