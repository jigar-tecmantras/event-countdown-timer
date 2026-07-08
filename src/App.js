import { useEffect, useMemo, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'event-countdown-timer-events';

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const loadEvents = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((event) => ({
      ...event,
      id: event.id ?? createId(),
    }));
  } catch (error) {
    console.warn('Unable to read saved events', error);
    return [];
  }
};

const saveEvents = (events) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn('Unable to persist events', error);
  }
};

const formatTimeParts = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value) => String(value).padStart(2, '0');

  return { days, hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
};

const getStatusLabel = (diffMs) => (diffMs <= 0 ? 'Completed' : 'Live');

function App() {
  const [events, setEvents] = useState(() => loadEvents());
  const [formData, setFormData] = useState({ title: '', target: '' });
  const [errors, setErrors] = useState({});
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const nextEvent = useMemo(() => {
    if (!events.length) return null;
    const upcoming = [...events]
      .map((event) => ({
        ...event,
        diff: new Date(event.target).getTime() - now,
      }))
      .filter((event) => event.diff > 0)
      .sort((a, b) => a.diff - b.diff);
    return upcoming[0] ?? null;
  }, [events, now]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const validationErrors = {};
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      validationErrors.title = 'Give it a memorable title.';
    }

    if (!formData.target) {
      validationErrors.target = 'Select a future date and time.';
    } else {
      const targetTimestamp = new Date(formData.target).getTime();
      if (Number.isNaN(targetTimestamp)) {
        validationErrors.target = 'That does not look like a valid date.';
      } else if (targetTimestamp <= Date.now()) {
        validationErrors.target = 'Please pick a date/time in the future.';
      }
    }

    const duplicate = events.some(
      (item) =>
        item.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        item.target === formData.target
    );

    if (!validationErrors.title && duplicate) {
      validationErrors.title = 'An identical countdown already exists.';
    }

    return { validationErrors, trimmedTitle };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { validationErrors, trimmedTitle } = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const newCountdown = {
      id: createId(),
      title: trimmedTitle,
      target: formData.target,
    };

    setEvents((prev) => [...prev, newCountdown]);
    setFormData({ title: '', target: '' });
    setErrors({});
  };

  const removeEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const clearAll = () => {
    setEvents([]);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Event Countdown Timer</p>
          <h1>Track every milestone at a glance.</h1>
          <p className="hero__subtitle">
            Add as many events as you need, and let the live timer keep you informed down to the second.
          </p>
          {nextEvent && (
            <p className="hero__next">
              Next up: <strong>{nextEvent.title}</strong> in <strong>{formatTimeParts(nextEvent.diff).days}</strong> days.
            </p>
          )}
        </div>
      </header>

      <section className="form-card">
        <div>
          <h2>Add a new countdown</h2>
          <p>Create reminders for vacations, launches, or personal milestones.</p>
        </div>
        <form className="countdown-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="title">Event title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Conference keynote, Anniversary, etc."
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && <p className="field-error">{errors.title}</p>}

          <label htmlFor="target">Target date & time</label>
          <input
            id="target"
            name="target"
            type="datetime-local"
            value={formData.target}
            onChange={handleInputChange}
            aria-invalid={Boolean(errors.target)}
          />
          {errors.target && <p className="field-error">{errors.target}</p>}

          <div className="form-actions">
            <button type="submit">Save countdown</button>
            <button type="button" className="ghost" onClick={() => setFormData({ title: '', target: '' })}>
              Reset form
            </button>
          </div>
        </form>
      </section>

      <section className="event-board" aria-live="polite">
        <div className="event-board__header">
          <h2>Your events</h2>
          <button type="button" className="ghost" disabled={!events.length} onClick={clearAll}>
            Clear all
          </button>
        </div>
        {events.length === 0 ? (
          <p className="empty-state">No countdowns yet. Add your first target date to get started.</p>
        ) : (
          <ul className="event-grid">
            {events.map((event) => {
              const targetTimestamp = new Date(event.target).getTime();
              const diff = targetTimestamp - now;
              const { days, hours, minutes, seconds } = formatTimeParts(diff);
              const isComplete = diff <= 0;

              return (
                <li key={event.id} className={`event-card ${isComplete ? 'event-card--complete' : ''}`}>
                  <div className="event-card__content">
                    <div>
                      <p className="event-card__title">{event.title}</p>
                      <p className="event-card__target">Target: {new Date(event.target).toLocaleString()}</p>
                    </div>
                    <span className="event-card__status">{getStatusLabel(diff)}</span>
                  </div>
                  <div className="event-card__countdown">
                    <div>
                      <span>{days}</span>
                      <small>days</small>
                    </div>
                    <div>
                      <span>{hours}</span>
                      <small>hrs</small>
                    </div>
                    <div>
                      <span>{minutes}</span>
                      <small>mins</small>
                    </div>
                    <div>
                      <span>{seconds}</span>
                      <small>secs</small>
                    </div>
                  </div>
                  <div className="event-card__actions">
                    <button type="button" onClick={() => removeEvent(event.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
