import { FunctionalComponent, h } from 'preact';
import { Row } from './general/row';
import { Keyboard } from './keyboard';

import { useEffect, useState, useCallback } from 'preact/hooks';
import Modal from './general/modal';

import { DateTime, Duration } from 'luxon';
import Loader from './general/loader';

import { Toaster, toast } from 'react-hot-toast';
import { getDaysDifference } from '../utils';
import Result from './result';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  .split('')
  .concat(['BACKSPACE', 'ENTER']);

const App: FunctionalComponent = () => {
  const [attempts, setAttempts] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctWord, setCorrectWord] = useState('');
  const [disabledChars, setDisabledChars] = useState<string[]>([]);
  const [hasWon, setWon] = useState(false);
  const [showModal, setShow] = useState(false);
  const [isBooting, setBooting] = useState(true);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const validate = useCallback((): void => {
    if (current.length != 5 || hasWon) return;
    if (availableWords.indexOf(current) == -1) {
      toast('Tidak ada dalam list kata.');
      return;
    }
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
  }, [current, correctWord, hasWon, availableWords]);

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

      const resAll = await fetch('/words-valid.txt');
      if (resAll.status !== 200) throw Error();

      const words = (await res.text()).toUpperCase().split('\n');
      const validWords = (await resAll.text()).toUpperCase().split('\n');
      setAvailableWords(validWords);
      setCorrectWord(words[days]);
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
    if (!isBooting) {
      const days = getDaysDifference();
      localStorage.setItem('attempts', JSON.stringify(attempts));
      localStorage.setItem('last', days.toString());
    }

    if (attempts.length >= 6) setWon(true);
  }, [attempts]);

  useEffect(() => {
    document.addEventListener('keydown', onPhysKeyboard);

    return (): void => document.removeEventListener('keydown', onPhysKeyboard);
  }, [onPhysKeyboard]);

  return (
    <div id="preact_root">
      <Loader>
        <Modal title="Informasi" show={showModal} setShow={setShow}>
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

          <h3 className="font-assistant font-bold">Atribusi</h3>
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

        <div className="h-screen w-screen bg-gray-800">
          <div className="mx-auto flex h-full max-w-sm flex-col items-center justify-center space-y-2">
            <div className="flex w-full flex-row items-center justify-between p-4">
              <h3 className="font-montserrat text-2xl text-white">KATALY</h3>
              <i
                class="fas fa-info-circle fa-lg cursor-pointer text-white"
                onClick={(): void => setShow(true)}
              />
            </div>
            <div className="flex h-full flex-col justify-between">
              <div className="flex w-full flex-col space-y-4">
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
                  <Result correctWord={correctWord} attempts={attempts} />
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
      <Toaster />
    </div>
  );
};

export default App;
