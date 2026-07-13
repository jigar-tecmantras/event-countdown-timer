# Event Countdown Timer

A full-stack countdown experience that lets users save multiple events and watch live timers for each milestone. The React frontend talks to a small Node/Express API that keeps events persisted between restarts.

## Repository layout

| Folder | Purpose |
| --- | --- |
| `backend/` | Node.js + Express API that stores events in `data/events.json` and exposes CRUD endpoints at `/api/events`. |
| `frontend/` | Create React App frontend that renders the countdown cards, validates input, and synchronizes with the backend while also keeping a local `localStorage` cache. |

## Getting started

### Run the backend API

```bash
cd backend
npm install
PORT=4000 npm start
```

Once running, the API listens on `http://localhost:4000` and exposes:

- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

More details and sample payloads are documented in `backend/README.md`.

### Run the React frontend

```bash
cd frontend
npm install
REACT_APP_API_BASE_URL=http://localhost:4000/api npm start
```

If you run the frontend without the `REACT_APP_API_BASE_URL` variable, it still defaults to `http://localhost:4000/api`. The `.env.example` in the frontend folder shows the expected key.

## Build & test

| Area | Command | Notes |
| --- | --- | --- |
| Frontend build | `cd frontend && npm run build` | Creates a production bundle in `frontend/build/`. |
| Frontend tests | `cd frontend && npm test` | Runs CRA's test runner. |
| Backend dev | `cd backend && npm run dev` | Uses `nodemon` for automatic restarts. |

## Helpful hints

- The backend automatically bootstraps `backend/data/events.json` on first write, so there is no manual migration.
- If the API is unreachable, the frontend falls back to local state and displays an offline badge.
- Deploying both services together just requires pointing the frontend's `REACT_APP_API_BASE_URL` at the hosted API.
