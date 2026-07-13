# Frontend - Event Countdown Timer

The React app lives inside `frontend/`. It consumes the backend API but keeps a local cache in `localStorage` so you can still add events when the server is unreachable.

## Prerequisites

- Node.js 18 or newer
- The backend API (see `../backend/README.md`) should ideally be running on `http://localhost:4000` or your chosen host before starting the frontend.

## Setup

```bash
cd frontend
npm install
```

## Environment

Set `REACT_APP_API_BASE_URL` when you need to point the app at a different backend host. A sample `.env.example` is provided next to the CRA sources.

For local development with the default backend port:

```bash
REACT_APP_API_BASE_URL=http://localhost:4000/api npm start
```

If you omit the variable, the app defaults to `http://localhost:4000/api`.

## Available scripts

- `npm start` – Starts the development server (`localhost:3000`).
- `npm run build` – Builds a production bundle that can sit behind a static host.
- `npm test` – Launches the CRA test runner (press `a` to run all tests).
