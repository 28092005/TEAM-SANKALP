import pytest

from backend.app.config import settings
from backend.app.data import normalize_filters, normalize_prompt, read_only_sqlite, resolve_relative_date, validate_sql_guard
from tests.test_golden import run_golden_tests


class TestDateResolution:
    def test_last_month(self):
        assert resolve_relative_date('last month') == '2026-08'

    def test_q2(self):
        assert resolve_relative_date('Q2') == '2026-Q2'

    def test_september(self):
        assert resolve_relative_date('September') == '2026-09'

    def test_august(self):
        assert resolve_relative_date('August') == '2026-08'


class TestSQLGuard:
    def test_reject_delete(self):
        with pytest.raises(ValueError, match='Non-read-only SQL blocked'):
            validate_sql_guard('DELETE FROM orders')

    def test_reject_drop(self):
        with pytest.raises(ValueError, match='Non-read-only SQL blocked'):
            validate_sql_guard('DROP TABLE orders')

    def test_reject_update(self):
        with pytest.raises(ValueError, match='Non-read-only SQL blocked'):
            validate_sql_guard('UPDATE orders SET status="delivered"')

    def test_reject_insert(self):
        with pytest.raises(ValueError, match='Non-read-only SQL blocked'):
            validate_sql_guard('INSERT INTO orders VALUES (...)')

    def test_accept_select(self):
        result = validate_sql_guard('SELECT * FROM orders LIMIT 10')
        assert result['ok'] is True

    def test_reject_multiple_selects(self):
        with pytest.raises(ValueError, match='Only one SELECT'):
            validate_sql_guard('SELECT * FROM orders; SELECT * FROM customers')


class TestNormalizeFilters:
    def test_normalize_empty(self):
        result = normalize_filters(None)
        assert result == {}

    def test_normalize_region(self):
        result = normalize_filters({'region': 'Karnataka'})
        assert result['region'] == 'Karnataka'

    def test_normalize_defaults(self):
        result = normalize_filters({})
        assert 'region' in result
        assert 'category' in result
        assert 'status' in result
        assert 'dateRange' in result


class TestNormalizePrompt:
    def test_normalize_whitespace(self):
        result = normalize_prompt('Show   Karnataka   sales')
        assert result == 'Show Karnataka sales'

    def test_normalize_strip(self):
        result = normalize_prompt('  Show Karnataka sales  ')
        assert result == 'Show Karnataka sales'


class TestGoldenFlows:
    def test_golden_flows_pass(self):
        assert run_golden_tests()
