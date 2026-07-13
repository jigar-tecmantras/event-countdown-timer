import { computeRemainingTime, formatTargetDate } from '../utils/time';

const CountdownItem = ({ event, now, onRemove }) => {
  const remaining = computeRemainingTime(event.targetDate, now);
  if (!remaining) {
    return null;
  }

  const timeBlocks = [
    { label: 'Days', value: remaining.days },
    { label: 'Hours', value: remaining.hours },
    { label: 'Minutes', value: remaining.minutes },
    { label: 'Seconds', value: remaining.seconds }
  ];

  return (
    <article className={`countdown-card ${remaining.isExpired ? 'expired' : ''}`}>
      <div className="countdown-card-header">
        <div>
          <h3>{event.title}</h3>
          <p className="target-date">Target: {formatTargetDate(event.targetDate)}</p>
        </div>
        <button type="button" className="ghost-btn" onClick={onRemove} aria-label="Remove event">
          Remove
        </button>
      </div>
      {remaining.isExpired ? (
        <p className="status-tag" role="status">
          Event has passed
        </p>
      ) : (
        <div className="time-grid">
          {timeBlocks.map((block) => (
            <div key={block.label} className="time-block">
              <span className="time-value">{String(block.value).padStart(2, '0')}</span>
              <span className="time-label">{block.label}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default CountdownItem;
