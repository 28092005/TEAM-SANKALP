import sqlite3
import re
from typing import Any, Dict, List, Optional


def normalize_prompt(prompt: str) -> str:
    return re.sub(r"\s+", " ", (prompt or "").strip())


def resolve_relative_date(expression: str) -> str:
    value = normalize_prompt(expression).lower()
    if not value:
        return "2026-09"
    if "last month" in value or "previous month" in value:
        return "2026-08"
    if "q2" in value or "second quarter" in value:
        return "2026-Q2"
    if "last quarter" in value or "q4" in value:
        return "2026-Q4"
    if "september" in value:
        return "2026-09"
    if "august" in value:
        return "2026-08"
    if "july" in value:
        return "2026-07"
    if "june" in value:
        return "2026-06"
    return "2026-09"


def validate_sql_guard(sql_text: str) -> Dict[str, Any]:
    normalized = (sql_text or "").strip()
    if not normalized:
        raise ValueError("Empty SQL query")

    lower = normalized.lower()
    blocked = [
        "drop ", "delete ", "update ", "insert ", "alter ", "truncate ",
        "grant ", "revoke ", "replace ", "attach ", "detach ", "pragma ",
        "create ", "drop table", "delete from"
    ]
    for token in blocked:
        if token in lower:
            raise ValueError(f"Non-read-only SQL blocked: {token}")

    if lower.count("select") != 1:
        raise ValueError("Only one SELECT statement is allowed")

    return {"ok": True, "sql": normalized}


def read_only_sqlite(db_path: str, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
    validate_sql_guard(query)
    connection = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    try:
        cursor = connection.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        columns = [col[0] for col in (cursor.description or [])]
        return [dict(zip(columns, row)) for row in rows]
    finally:
        connection.close()


def normalize_filters(ui_state: Optional[Dict[str, Any]]) -> Dict[str, str]:
    if not ui_state:
        return {}
    return {
        "region": str(ui_state.get("currentRegion") or ui_state.get("region") or "All Regions"),
        "category": str(ui_state.get("currentCategory") or ui_state.get("category") or "All Categories"),
        "status": str(ui_state.get("status") or "All"),
        "dateRange": str(ui_state.get("dateRange") or "FY 2025-2026 (Oct 2025 - Sep 2026)"),
    }


def load_metadata(path: Optional[str] = None) -> Dict[str, Any]:
    import json
    from pathlib import Path
    metadata_path = Path(path) if path else Path(__file__).resolve().parents[2] / "metadata.json"
    with open(metadata_path, "r", encoding="utf-8") as handle:
        return json.load(handle)
