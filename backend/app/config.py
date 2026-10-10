from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / '.env', override=False)

BASE_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = BASE_DIR / 'backend'
DB_DIR = BASE_DIR

class Settings:
    APP_NAME: str = 'TEAM-SANKALP Backend'
    APP_ENV: str = os.getenv('APP_ENV', 'development')
    FRONTEND_URL: str = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    API_HOST: str = os.getenv('API_HOST', '0.0.0.0')
    API_PORT: int = int(os.getenv('API_PORT', '8000'))
    GEMINI_API_KEY: str = os.getenv('GEMINI_API_KEY', '')
    SALES_DB_PATH: str = os.getenv('SALES_DB_PATH', str(DB_DIR / 'sales.db'))
    APP_DB_PATH: str = os.getenv('APP_DB_PATH', str(DB_DIR / 'app.db'))
    METADATA_PATH: str = os.getenv('METADATA_PATH', str(BASE_DIR / 'metadata.json'))
    ENABLE_BENCHMARKS: bool = os.getenv('ENABLE_BENCHMARKS', 'true').lower() == 'true'

settings = Settings()
