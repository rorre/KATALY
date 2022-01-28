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
    className={`border border-gray-600 rounded-md
          flex items-center justify-center
          w-12 h-12 aspect-square
          text-white font-montserrat font-bold
          ${char != ' ' && 'bg-gray-600'} 
          ${isCorrect && 'bg-green-600'} 
          ${isWrongPosition && 'bg-yellow-600'} 
          ${showAnswer && 'transition'}`}
  >
    {char}
  </div>
);
