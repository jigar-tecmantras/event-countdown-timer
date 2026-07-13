const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

export const computeRemainingTime = (targetIso, now = Date.now()) => {
  const target = Date.parse(targetIso);
  if (Number.isNaN(target)) {
    return null;
  }
  const diff = target - now;
  const delta = Math.max(diff, 0);
  const isExpired = diff <= 0;
  const days = Math.floor(delta / MS_PER_DAY);
  const hours = Math.floor((delta % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((delta % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((delta % MS_PER_MINUTE) / MS_PER_SECOND);

  return { isExpired, days, hours, minutes, seconds };
};

export const formatTargetDate = (targetIso) => {
  const date = new Date(targetIso);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};
