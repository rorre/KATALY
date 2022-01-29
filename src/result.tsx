import { Duration } from 'luxon';
import { FunctionComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { baseDatetime, getDaysDifference } from './utils';

interface ResultProps {
  correctWord: string;
}

const Result: FunctionComponent<ResultProps> = ({ correctWord }) => {
  const [nextWordTime, setNextWordTime] = useState(Duration.fromMillis(0));

  useEffect(() => {
    const intervalCode = setInterval(() => {
      setNextWordTime(
        baseDatetime
          .plus({ days: getDaysDifference() + 1 })
          .diffNow(['hours', 'minutes', 'second'])
      );
    }, 1000);
  });

  return (
    <div className="flex flex-col text-center space-y-2">
      <h3 className="font-montserrat font-bold text-6xl text-white">
        {correctWord}
      </h3>
      <a
        href={`https://kbbi.kemdikbud.go.id/entri/${correctWord.toLowerCase()}`}
        className="text-blue-600 cursor-pointer font-assistant text-xl hover:underline"
      >
        Entri KBBI
      </a>
      <p className="font-sans text-white">Kata selanjutnya dalam</p>
      <p className="font-assistant text-xl font-bold text-white">
        {nextWordTime.hours}:{nextWordTime.minutes}:
        {Math.floor(nextWordTime.seconds)}
      </p>
    </div>
  );
};

export default Result;
