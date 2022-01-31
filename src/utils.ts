import { DateTime } from 'luxon';

const baseDatetime = DateTime.fromISO('2022-01-28T00:00:00.000+07:00');

function getDaysDifference(): number {
  const difference = baseDatetime.diffNow('days');
  const days = Math.floor(Math.abs(difference.days));
  return days;
}

function getDisabledChars(correctWord: string, answer: string) {
  const newDisabledChar: string[] = [];
  for (let i = 0; i < answer.length; i++) {
    const currentChar = answer[i];
    if (correctWord.indexOf(currentChar) == -1) {
      newDisabledChar.push(currentChar);
    }
  }
  return newDisabledChar;
}

export { getDaysDifference, getDisabledChars, baseDatetime };
