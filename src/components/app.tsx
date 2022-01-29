import { FunctionalComponent, h } from 'preact';
import { Row } from './general/row';
import { Keyboard } from './keyboard';

import { useEffect, useState, useCallback } from 'preact/hooks';
import Modal from './general/modal';

import { DateTime, Duration } from 'luxon';
import Loader from './general/loader';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  .split('')
  .concat(['BACKSPACE', 'ENTER']);

const baseDatetime = DateTime.fromISO('2022-01-28T00:00:00.000+07:00');

function getDaysDifference(): number {
  const difference = baseDatetime.diffNow('days');
  const days = Math.floor(Math.abs(difference.days));
  return days;
}

const App: FunctionalComponent = () => {
  const [attempts, setAttempts] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctWord, setCorrectWord] = useState('');
  const [disabledChars, setDisabledChars] = useState<string[]>([]);
  const [hasWon, setWon] = useState(false);
  const [showModal, setShow] = useState(false);
  const [isBooting, setBooting] = useState(true);

  const [nextWordTime, setNextWordTime] = useState(Duration.fromMillis(0));

  const validate = useCallback((): void => {
    if (current.length != 5 || hasWon) return;
    const copiedString = current.toUpperCase();

    const newDisabledChar: string[] = [];
    for (let i = 0; i < current.length; i++) {
      const currentChar = current[i];
      if (correctWord.indexOf(currentChar) == -1) {
        newDisabledChar.push(currentChar);
      }
    }
    setDisabledChars((disabledChars) => [...disabledChars, ...newDisabledChar]);

    setShowAnswer(true);
    setTimeout(() => {
      setCurrent('');
      setShowAnswer(false);
      setAttempts((attempts) => [...attempts, copiedString]);
      setWon(current == correctWord);
    }, 500);
  }, [current, correctWord, hasWon]);

  const onKeyboardClick = useCallback(
    (char: string): void => {
      if (char == 'BACKSPACE') {
        return setCurrent(current.slice(0, -1));
      } else if (char == 'ENTER') {
        if (current.length == 5) validate();
        return;
      }
      if (current.length == 5) return;
      return setCurrent(current + char);
    },
    [current, validate]
  );

  const onPhysKeyboard = useCallback(
    (event: KeyboardEvent): void => {
      const key = event.key.toUpperCase();
      if (ALPHABET.indexOf(key) != -1) {
        onKeyboardClick(key);
        event.preventDefault();
      }
    },
    [onKeyboardClick]
  );

  useEffect(() => {
    const days = getDaysDifference();
    async function cb(): Promise<void> {
      const res = await fetch('/words.txt');
      if (res.status !== 200) throw Error();

      const words = (await res.text()).split('\n');
      setCorrectWord(words[days].toUpperCase());
    }
    cb();
  }, []);

  useEffect(() => {
    const days = getDaysDifference();
    const lastAttempts: string[] = JSON.parse(
      localStorage.getItem('attempts') ?? '[]'
    );
    const lastDay = Number(localStorage.getItem('last') ?? 0);
    const lastCurrent = lastAttempts.pop() ?? '';

    if (correctWord.length == 5) {
      if (days == lastDay) {
        setAttempts(lastAttempts);
        if (lastCurrent != '') {
          setCurrent(lastCurrent);
        }
      } else {
        setAttempts([]);
      }
      setBooting(false);
    }
  }, [correctWord]);

  useEffect(() => {
    if (!isBooting) validate();
  }, [isBooting]);

  useEffect(() => {
    const days = getDaysDifference();

    if (!isBooting) {
      localStorage.setItem('attempts', JSON.stringify(attempts));
      localStorage.setItem('last', days.toString());
    }
  }, [attempts]);

  useEffect(() => {
    document.addEventListener('keydown', onPhysKeyboard);
    const intervalCode = setInterval(() => {
      setNextWordTime(
        baseDatetime
          .plus({ days: getDaysDifference() + 1 })
          .diffNow(['hours', 'minutes', 'second'])
      );
    }, 1000);

    return (): void => {
      document.removeEventListener('keydown', onPhysKeyboard);
      clearInterval(intervalCode);
    };
  }, [onPhysKeyboard]);

  useEffect(() => {
    if (attempts.length >= 6) setWon(true);
  }, [attempts]);

  return (
    <div id="preact_root">
      <Loader>
        <Modal title="Information" show={showModal} setShow={setShow}>
          <p className="text-center font-assistant">
            Kataly adalah permainan{' '}
            <a
              href="https://www.powerlanguage.co.uk/wordle/"
              className="text-blue-600 hover:underline"
            >
              WORDLE
            </a>{' '}
            menggunakan bahasa Indonesia.
          </p>

          <h3 className="font-assistant font-bold">Cara Bermain</h3>
          <p className="font-assistant">Kamu mempunyai 6 kesempatan.</p>
          <Row word="KERJA" correctWord="KDDDD" showAnswer={true} />
          <p className="font-assistant">
            Apabila pada percobaan sebelumnya terdapat huruf yang mempunyai
            background hijau, maka kamu menebak huruf tersebut pada posisi yang
            tepat.
          </p>
          <Row word="KERJA" correctWord="ZZZZE" showAnswer={true} />
          <p className="font-assistant">
            Apabila pada percobaan sebelumnya terdapat huruf yang mempunyai
            background kuning maka kamu menebak huruf dengan tepat, namun
            posisinya salah.
          </p>

          <h3 className="font-assistant font-bold">Attribusi</h3>
          <p className="font-assistant">
            Kata-kata yang didapat berasal dari{' '}
            <a
              href="http://kateglo.com/"
              className="text-blue-600 hover:underline"
            >
              Kateglo.com
            </a>{' '}
            yang berada di bawah lisensi CC-BY-NC-SA 3.0.
          </p>

          <a href="https://twitter.com/ro_rre" className="text-center">
            <i class="fab fa-3x fa-twitter text-gray-500 hover:text-blue-500" />
          </a>
        </Modal>

        <div className="bg-gray-800 w-screen h-screen">
          <div className="max-w-sm flex flex-col space-y-2 items-center justify-center mx-auto h-full">
            <div className="flex flex-row justify-between w-full items-center p-4">
              <h3 className="font-montserrat text-2xl text-white">KATALY</h3>
              <i
                class="fas fa-info-circle fa-lg text-white cursor-pointer"
                onClick={(): void => setShow(true)}
              />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="w-full flex-col flex space-y-4">
                {attempts.map((attempt, idx) => (
                  <Row
                    word={attempt}
                    key={`attempt-${idx}`}
                    showAnswer={true}
                    correctWord={correctWord}
                  />
                ))}

                {!hasWon && attempts.length < 6 && (
                  <Row
                    word={current}
                    correctWord={correctWord}
                    showAnswer={showAnswer}
                  />
                )}

                {attempts.length < 6 &&
                  [...new Array(6 - Number(!hasWon) - attempts.length)].map(
                    (_, idx) => (
                      <Row
                        word=""
                        key={`possible-${idx}`}
                        correctWord={correctWord}
                      />
                    )
                  )}

                {hasWon && (
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
                    <p className="font-sans text-white">
                      Kata selanjutnya dalam
                    </p>
                    <p className="font-assistant text-xl font-bold text-white">
                      {nextWordTime.hours}:{nextWordTime.minutes}:
                      {Math.floor(nextWordTime.seconds)}
                    </p>
                  </div>
                )}
              </div>

              {!hasWon && (
                <Keyboard
                  onClick={onKeyboardClick}
                  disabledChars={disabledChars}
                />
              )}
            </div>
          </div>
        </div>
      </Loader>
    </div>
  );
};

export default App;
