# Backend - Event Countdown Timer API

This folder contains a lightweight Express + CORS API that persists countdown events to a JSON-backed store. The frontend reads, creates, and removes events through this service, but the React app will continue to work locally if the API is unavailable.

## Prerequisites

- Node.js 18 or newer
- Yarn or npm (this repo uses npm in the scripts below)

## Setup

```bash
cd backend
npm install
```

## Available scripts

| script | description |
| --- | --- |
| `npm start` | Starts the API with `node index.js`. Use `PORT` to override the listening port (`PORT=5000 npm start`). |
| `npm run dev` | Starts the API with `nodemon` for fast reloads during development. |

## API contract

All endpoints live under `/api`.

### `GET /api/events`
Return value: `{ events: Event[] }`

### `POST /api/events`
Create a countdown. Body must include:

```json
{
  "title": "Product launch",
  "target": "2026-12-31T23:59:00.000Z"
}
```

Successful response: `{ event: Event }`

### `PUT /api/events/:id`
Update the title or target. Payload can include either property or both. If a new `target` is provided, it must still sit in the future.

### `DELETE /api/events/:id`
Removes an event. Returns `204 No Content` on success.

> **Event shape**
> ```json
> {
>   "id": "uuid",
>   "title": "Marketing campaign",
>   "target": "2026-10-01T12:00:00.000Z",
>   "createdAt": "2026-07-13T08:00:00.000Z",
>   "updatedAt": "2026-07-13T08:00:00.000Z"
> }
> ```

## Persistence

Events are saved in `backend/data/events.json`. The API ensures the directory and file exist and will reset the file if the JSON becomes corrupted.

## Notes

- CORS is intentionally wide open so the frontend can hit the API from `localhost:3000` or a deployed domain.
- The frontend defaults to `http://localhost:4000/api` but the base path can be overridden through `REACT_APP_API_BASE_URL`.
