import { DateTime } from 'luxon';

const baseDatetime = DateTime.fromISO('2022-01-28T00:00:00.000+07:00');

function getDaysDifference(): number {
  const difference = baseDatetime.diffNow('days');
  const days = Math.floor(Math.abs(difference.days));
  return days;
}

export { getDaysDifference, baseDatetime };
