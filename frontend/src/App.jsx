import { useEffect, useMemo, useState } from 'react';
import CountdownList from './components/CountdownList';
import EventForm from './components/EventForm';
import './App.css';

const STORAGE_KEY = 'eventCountdowns';

const readStoredEvents = () => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Unable to read stored events', error);
    return [];
  }
};

const saveEvents = (events) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Unable to store events', error);
  }
};

const createEventId = () => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
};

function App() {
  const [events, setEvents] = useState(() => readStoredEvents());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate)),
    [events]
  );

  const handleAddEvent = (event) => {
    const nextEvent = { ...event, id: createEventId() };
    setEvents((prev) => [...prev, nextEvent]);
  };

  const handleRemove = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const heroTitle = process.env.REACT_APP_TITLE?.trim() || 'Event Countdown Timer';

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Live countdowns</p>
        <h1>{heroTitle}</h1>
        <p className="lede">
          Add events, pick a date and time, and watch days, hours, minutes, and seconds count down
          in real time.
        </p>
      </header>
      <main className="content-grid">
        <EventForm onAddEvent={handleAddEvent} />
        <CountdownList events={sortedEvents} now={now} onRemove={handleRemove} />
      </main>
    </div>
  );
}

export default App;
