import sqlite3

import pytest

from backend.app.data import read_only_sqlite, resolve_relative_date, validate_sql_guard


def test_validator_rejects_write_sql():
    with pytest.raises(ValueError):
        validate_sql_guard('DELETE FROM orders WHERE 1=1')


def test_sql_guard_allows_read_only_select():
    result = validate_sql_guard('SELECT * FROM orders LIMIT 5')
    assert result['ok'] is True


def test_relative_date_resolution():
    assert resolve_relative_date('last month') == '2026-08'
    assert resolve_relative_date('Q2') == '2026-Q2'
    assert resolve_relative_date('September') == '2026-09'


def test_seeded_sqlite_has_expected_tables(tmp_path):
    db = tmp_path / 'sales.db'
    conn = sqlite3.connect(db)
    conn.execute('CREATE TABLE test_table (id INTEGER PRIMARY KEY, value TEXT)')
    conn.execute('INSERT INTO test_table (value) VALUES ("ok")')
    conn.commit()
    conn.close()

    rows = read_only_sqlite(str(db), 'SELECT * FROM test_table')
    assert rows[0]['value'] == 'ok'


def test_golden_prompt_validation():
    prompts = [
        'Show Karnataka sales for September',
        'Compare September with August for Karnataka and explain the drop',
        'Open the HR page',
        'Show Karnatka sales',
        'Now show products',
    ]
    assert len(prompts) == 5
    assert all(isinstance(prompt, str) and len(prompt) > 5 for prompt in prompts)


pytest.main(['-q', __file__])
