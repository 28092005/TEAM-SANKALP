from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Optional

from backend.app.agent import BackendAgent


def load_golden_tests() -> list[Dict[str, Any]]:
    golden_path = Path(__file__).resolve().parents[2] / 'golden.json'
    with open(golden_path, 'r', encoding='utf-8') as fh:
        return json.load(fh)


def validate_golden_flow(test_case: Dict[str, Any], agent: BackendAgent) -> Dict[str, Any]:
    response = agent.build_response(test_case['prompt'], {})
    result = {'test_id': test_case['id'], 'prompt': test_case['prompt'], 'passed': False, 'errors': []}

    if test_case.get('expected_refusal'):
        if response.get('trace', [''])[0] == 'refusal':
            reply = response.get('reply', '')
            if test_case.get('expected_refusal_code') in reply:
                result['passed'] = True
            else:
                result['errors'].append(f"Refusal code mismatch: expected {test_case.get('expected_refusal_code')}")
        else:
            result['errors'].append('Expected refusal but got success response')
        return result

    if test_case.get('expected_clarification'):
        if response.get('trace', [''])[0] == 'clarification':
            reply = response.get('reply', '')
            if test_case.get('expected_clarification_keyword', '') in reply:
                result['passed'] = True
            else:
                result['errors'].append(f"Clarification keyword mismatch: expected {test_case.get('expected_clarification_keyword')}")
        else:
            result['errors'].append('Expected clarification but got other response')
        return result

    actions = response.get('actions', [])
    if actions and actions[0].get('page') == test_case.get('expected_page'):
        result['passed'] = True
    else:
        result['errors'].append(f"Page mismatch: expected {test_case.get('expected_page')}, got {actions[0].get('page') if actions else 'none'}")

    if test_case.get('expected_keywords'):
        reply = response.get('reply', '')
        for keyword in test_case['expected_keywords']:
            if keyword not in reply:
                result['errors'].append(f"Missing keyword: {keyword}")
                result['passed'] = False

    return result


def run_golden_tests() -> None:
    agent = BackendAgent()
    tests = load_golden_tests()
    results = []

    for test_case in tests:
        result = validate_golden_flow(test_case, agent)
        results.append(result)
        status = '✓' if result['passed'] else '✗'
        print(f"{status} {result['test_id']}: {result['prompt'][:60]}")
        if result['errors']:
            for error in result['errors']:
                print(f"  - {error}")

    passed = sum(1 for r in results if r['passed'])
    total = len(results)
    print(f"\n{passed}/{total} golden tests passed")
    return passed == total


if __name__ == '__main__':
    import sys
    success = run_golden_tests()
    sys.exit(0 if success else 1)
