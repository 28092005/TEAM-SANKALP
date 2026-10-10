# TEAM SANKALP

A context-aware enterprise analytics and e-commerce intelligence application built for KLETECH FEST Domain 5 - Problem Statement 5A.

This project combines a modern React + TypeScript frontend with an AI-powered agent that interprets natural-language queries, navigates between dashboards, applies filters, and produces analytical insights from sales and operations data.

## Overview

TEAM SANKALP is designed to act like a business intelligence copilot for enterprise users. Instead of manually browsing dashboards, users can ask questions like:

- "Show Karnataka sales for last quarter"
- "Compare revenue this month vs last month"
- "Show cancelled orders"
- "Find top performing products in South India"

The app translates these prompts into real UI actions, updates filters, calculates relevant metrics, and presents results through a clean dashboard experience.

## Key Features

- AI-driven assistant for business analytics queries
- Context-aware navigation across multiple dashboard pages
- Dynamic filtering by region, category, status, and date range
- Role-based personas and enterprise access flows
- Live benchmark evaluation and architecture monitoring
- PDF and CSV export support
- Real-time notifications and approval workflow management
- Responsive dashboard for executive decision making

## Product Modules

The application includes multiple business intelligence views:

- Executive Dashboard
- Sales Report
- Product Performance
- Regional Analysis
- Customer Directory
- Order Management
- Benchmark Evaluation
- Agent Blackboard / Architecture View

## Technology Stack

- Frontend: React 19 + TypeScript + Vite
- Styling: Tailwind CSS
- Charts: Recharts
- Icons: Lucide React
- Animations: Motion
- AI Integration: Google GenAI / Gemini API
- Backend: Python services and data seeding utilities
- Data model: synthetic enterprise sales and operations datasets

## Project Structure

```bash
TEAM-SANKALP/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── seed_sales_db.py
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── ARCHITECTURE_AND_SYSTEM_SUMMARY.txt
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── golden.json
├── metadata.json
├── README.md
└── bun.lock
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example environment file and configure your values:

```bash
cp .env.example .env
```

Update the variables as needed for Gemini API access and app configuration.

### 3. Run the frontend

```bash
npm run dev
```

The app runs on the configured Vite dev server (default port 3000 in this project).

### 4. Prepare backend dependencies (if required)

```bash
pip install -r backend/requirements.txt
```

## Usage

After starting the app:

1. Log in using one of the available persona flows.
2. Open the AI assistant panel.
3. Ask a business question in natural language.
4. Review the agent's recommended navigation and filter updates.
5. Explore analytics, export data, or continue with follow-up prompts.

## Architecture Summary

The project follows a three-tier agent architecture:

- Intent decomposition and orchestration
- Knowledge graph and blackboard-style memory layer
- Execution engine that updates the UI and computes analytical responses

This allows the system to stay grounded in the actual app state and available business metadata while responding to user questions with minimal hallucination.

## Notes

- The repository includes synthetic enterprise data for demonstration and evaluation.
- The app is built to showcase AI-assisted BI workflows in a competitive hackathon environment.
- The project is optimized for a polished demo experience with real-time dashboards and actionable analytics.

## License

This project is intended for educational and competition use.

## Team

TEAM SANKALP
