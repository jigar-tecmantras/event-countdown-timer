import CountdownItem from './CountdownItem';

const CountdownList = ({ events, now, onRemove }) => {
  if (!events.length) {
    return (
      <section className="card empty-state" aria-live="polite">
        <h2>No events yet</h2>
        <p>Add your first event to begin monitoring the remaining time.</p>
      </section>
    );
  }

  return (
    <section className="countdown-grid" aria-live="polite">
      {events.map((event) => (
        <CountdownItem key={event.id} event={event} now={now} onRemove={() => onRemove(event.id)} />
      ))}
    </section>
  );
};

export default CountdownList;
