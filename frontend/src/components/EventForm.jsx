import { useState } from 'react';

const toLocalInput = (date = new Date()) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const EventForm = ({ onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  const minDateTime = toLocalInput(new Date());

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please provide a title for the event.');
      return;
    }

    if (!target) {
      setError('Select a future date and time.');
      return;
    }

    const parsed = new Date(target);
    if (Number.isNaN(parsed.getTime())) {
      setError('The chosen date/time is invalid.');
      return;
    }

    if (parsed.getTime() <= Date.now()) {
      setError('Target must be in the future.');
      return;
    }

    onAddEvent({ title: trimmedTitle, targetDate: parsed.toISOString() });
    setTitle('');
    setTarget('');
  };

  const isDisabled = !title.trim() || !target;

  return (
    <section className="card form-card" aria-label="Add countdown event">
      <h2>Add event</h2>
      <p className="muted">
        Save as many milestones as you like. The timers update every second and stick around even after
        a refresh.
      </p>
      <form className="event-form" onSubmit={handleSubmit} noValidate>
        <label>
          <span>Event title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Product launch"
            required
          />
        </label>
        <label>
          <span>Target date &amp; time</span>
          <input
            type="datetime-local"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            min={minDateTime}
            required
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="primary-btn" disabled={isDisabled}>
          Add event
        </button>
      </form>
    </section>
  );
};

export default EventForm;
