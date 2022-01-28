import { FunctionalComponent, h } from 'preact';
import { Box } from './box';

interface RowProps {
  word: string;
  correctWord: string;
  showAnswer?: boolean;
}

export const Row: FunctionalComponent<RowProps> = ({
  word,
  correctWord,
  key,
  showAnswer = false,
}) => {
  return (
    <div className="flex flex-row space-x-4 justify-center">
      {word
        .padEnd(5)
        .split('')
        .map((char, idx) => {
          const isCorrect = char == correctWord[idx] && showAnswer;
          const isWrongPosition =
            correctWord.indexOf(char) != -1 && showAnswer && !isCorrect;
          return (
            <Box
              key={`${key}-row-${idx}`}
              char={char}
              isCorrect={isCorrect}
              isWrongPosition={isWrongPosition}
              showAnswer={showAnswer}
            />
          );
        })}
    </div>
  );
};
