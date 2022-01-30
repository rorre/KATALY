import { FunctionalComponent, h } from 'preact';

interface BoxProps {
  char: string;
  showAnswer?: boolean;
  isCorrect?: boolean;
  isWrongPosition?: boolean;
}

export const Box: FunctionalComponent<BoxProps> = ({
  char,
  showAnswer = false,
  isCorrect = false,
  isWrongPosition = false,
}) => (
  <div
    className={`flex aspect-square h-12
          w-12 items-center justify-center
          rounded-md border border-gray-600
          font-montserrat font-bold text-white
          ${isCorrect && 'bg-green-600'} 
          ${isWrongPosition && 'bg-yellow-600'} 
          ${char != ' ' && !isCorrect && !isWrongPosition && 'bg-gray-600'} 
          ${showAnswer && 'transition'}`}
  >
    {char}
  </div>
);
