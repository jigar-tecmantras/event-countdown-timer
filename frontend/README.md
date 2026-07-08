# Event Countdown Timer

A Create React App that lets you track multiple upcoming events with live, second-level countdowns. Each event shows days, hours, minutes, and seconds remaining, and the UI clearly highlights completed milestones.

## Key Features

- Add any number of countdowns with a title and target date/time.
- Real-time timers that update every second without reloading the page.
- Validation prevents empty titles, past dates, and duplicates.
- Local storage persistence keeps events safe across refreshes.
- Clear UI states for upcoming versus completed events, plus the ability to remove or clear all entries.

## Tech Stack

- React (Create React App)
- React Hooks (`useState`, `useEffect`, `useMemo`)
- Native `localStorage` for persistence
- Vanilla CSS with CSS variables for theming

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

3. For a production-ready build:
   ```bash
   npm run build
   ```

## Future Ideas

- Add optional reminders or notifications.
- Support recurring countdowns with flexible intervals.
- Export/import event lists (JSON or calendar formats).

## Tested Commands

- `npm start` (development server)
- `npm run build` (production bundle)
