from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = BASE_DIR / 'backend'

load_dotenv(BASE_DIR / '.env', override=False)


class Settings:
    APP_NAME = 'TEAM-SANKALP Backend'
    APP_ENV = os.getenv('APP_ENV', 'development')
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', '8000'))
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    SALES_DB_PATH = os.getenv('SALES_DB_PATH', str(BASE_DIR / 'sales.db'))
    APP_DB_PATH = os.getenv('APP_DB_PATH', str(BASE_DIR / 'app.db'))
    METADATA_PATH = os.getenv('METADATA_PATH', str(BASE_DIR / 'metadata.json'))
    ENABLE_BENCHMARKS = os.getenv('ENABLE_BENCHMARKS', 'true').lower() == 'true'


settings = Settings()
