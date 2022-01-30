import { Duration } from 'luxon';
import { FunctionComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import toast from 'react-hot-toast';
import { baseDatetime, getDaysDifference } from '../utils';

interface ResultProps {
  attempts: string[];
  correctWord: string;
}

const Result: FunctionComponent<ResultProps> = ({ correctWord, attempts }) => {
  const [nextWordTime, setNextWordTime] = useState(Duration.fromMillis(0));

  function share(copy = false) {
    let textContent = `KATALY #${getDaysDifference() + 1} ${attempts.length}/6`;
    textContent += '\n\n';
    for (let word of attempts) {
      word.split('').forEach((char, idx) => {
        if (char == correctWord[idx]) {
          textContent += '🟩';
        } else if (correctWord.indexOf(char) != -1) {
          textContent += '🟧';
        } else {
          textContent += '⬜';
        }
      });
      textContent += '\n';
    }
    textContent += '\n';
    textContent += 'https://kataly.rorre.xyz/';

    if (copy) {
      window.navigator.clipboard.writeText(textContent.trim());
      toast.success('Copied!');
    } else {
      window.navigator.share({ text: textContent.trim() });
    }
  }

  useEffect(() => {
    const intervalCode = setInterval(() => {
      setNextWordTime(
        baseDatetime
          .plus({ days: getDaysDifference() + 1 })
          .diffNow(['hours', 'minutes', 'second'])
      );
    }, 1000);

    return () => clearInterval(intervalCode);
  });

  return (
    <div className="flex flex-col space-y-2 text-center">
      <h3 className="font-montserrat text-6xl font-bold text-white">
        {correctWord}
      </h3>

      <a
        href={`https://kbbi.kemdikbud.go.id/entri/${correctWord.toLowerCase()}`}
        className="cursor-pointer font-assistant text-xl text-blue-600 hover:underline"
      >
        Entri KBBI
      </a>

      <div className="flex flex-col">
        <p className="font-sans text-white">Kata selanjutnya dalam</p>
        <p className="font-assistant text-xl font-bold text-white">
          {nextWordTime.hours}:{nextWordTime.minutes}:
          {Math.floor(nextWordTime.seconds)}
        </p>
      </div>

      <button
        className="mx-8 cursor-pointer rounded-lg bg-green-600 py-2 font-assistant text-xl text-white"
        onClick={() => share(false)}
      >
        <i className="fas fa-share-alt px-2" />
        Share
      </button>
      <button
        className="mx-8 cursor-pointer rounded-lg bg-blue-600 py-2 font-assistant text-xl text-white"
        onClick={() => share(true)}
      >
        <i className="fas fa-copy px-2" />
        Copy
      </button>
    </div>
  );
};

export default Result;
