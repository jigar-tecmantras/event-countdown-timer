# Event Countdown Timer

A focused, front-end-first experience that lets you save as many events as you like and watch live countdowns for each milestone.

## Repository layout

| Folder | Purpose |
| --- | --- |
| `backend/` | Legacy Node/Express API that powered the previous version of this project. It is retained here for reference but is no longer required to run the countdown timer. |
| `frontend/` | Create React App that powers the interactive, single-page countdown experience described below. |

## Getting started

### Frontend only
1. `cd frontend`
2. `npm install`
3. `npm start`

The React app runs entirely in the browser and persists events in `localStorage`, so there is no need to boot up the backend.

### Build & test

| Command | Purpose |
| --- | --- |
| `npm run build` | Create a production bundle inside `frontend/build/`. |
| `npm test` | Run the built-in React testing library suite. |

## Features

- Add multiple events with custom titles and dates/times.
- Real-time countdown showing days, hours, minutes, and seconds.
- Events remain saved across reloads via `localStorage`.
- Remove events when they expire or if you change your plans.

## Environment variables

- `REACT_APP_TITLE` (optional) – overrides the hero title rendered at the top of the page. Empowers you to brand the experience per deployment.
