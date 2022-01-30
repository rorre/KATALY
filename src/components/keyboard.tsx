import { FunctionalComponent, h } from 'preact';

interface KBRowProps {
  disabledChars: string[];
  chars: string;
  onClick: (arg0: string) => void;
}

interface KBProps {
  disabledChars: string[];
  onClick: (arg0: string) => void;
}

const KeyboardRow: FunctionalComponent<KBRowProps> = ({
  chars,
  disabledChars,
  onClick,
  children,
}) => {
  return (
    <div className="flex flex-row justify-center space-x-1">
      {chars.split('').map((char, idx) => (
        <div
          key={`kb-${idx}`}
          className={`cursor-pointer select-none rounded px-2 py-1 font-sans text-2xl
                      ${
                        disabledChars.indexOf(char) != -1
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-200'
                      }`}
          onClick={() => onClick(char)}
        >
          {char}
        </div>
      ))}
      {children}
    </div>
  );
};

export const Keyboard: FunctionalComponent<KBProps> = ({
  disabledChars,
  onClick,
}) => {
  return (
    <div className="flex w-full flex-col space-y-1 rounded-t-md bg-gray-400 p-4">
      <KeyboardRow
        chars="QWERTYUIOP"
        onClick={onClick}
        disabledChars={disabledChars}
      />
      <KeyboardRow
        chars="ASDFGHJKL"
        onClick={onClick}
        disabledChars={disabledChars}
      >
        <div
          className="cursor-pointer select-none rounded bg-gray-200 px-2 py-1 font-sans text-2xl"
          onClick={() => onClick('BACKSPACE')}
        >
          ⌫
        </div>
      </KeyboardRow>
      <KeyboardRow
        chars="ZXCVBNM"
        onClick={onClick}
        disabledChars={disabledChars}
      >
        <div
          className="cursor-pointer select-none rounded bg-gray-200 px-2 py-1 font-sans text-2xl"
          onClick={() => onClick('ENTER')}
        >
          ↩
        </div>
      </KeyboardRow>
    </div>
  );
};
