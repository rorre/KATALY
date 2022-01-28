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
    <div className="flex flex-row space-x-1 justify-center">
      {chars.split('').map((char, idx) => (
        <div
          key={`kb-${idx}`}
          className={`font-sans px-2 py-1 text-3xl rounded select-none
                      ${
                        disabledChars.indexOf(char) != -1
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-200 cursor-pointer'
                      }`}
          onClick={() => {
            disabledChars.indexOf(char) == -1 && onClick(char);
          }}
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
    <div className="w-full bg-gray-400 flex flex-col p-4 rounded-t-md space-y-1">
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
          className="bg-gray-200 font-sans px-2 py-1 text-2xl rounded cursor-pointer select-none"
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
          className="bg-gray-200 font-sans px-2 py-1 text-3xl rounded cursor-pointer select-none"
          onClick={() => onClick('ENTER')}
        >
          ↩
        </div>
      </KeyboardRow>
    </div>
  );
};
