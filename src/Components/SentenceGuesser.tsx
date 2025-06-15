import * as React from 'react';
import { Language, isCharacter } from '../Utils';
import LetterInput from './LetterInput';

interface ISentenceGuesserProps {
  words: string[][];
  inputRefs: React.RefObject<HTMLInputElement>[][];
  languageToTranslateInto: Language;
  showBorderOnEmptyInput: boolean;
  onInput: (e: React.FormEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void;
  onRevealLetter: (wordNumber: number) => void;
}

const SentenceGuesser: React.FunctionComponent<ISentenceGuesserProps> = ({
  words,
  inputRefs,
  languageToTranslateInto,
  showBorderOnEmptyInput,
  onInput,
  onKeyUp,
  onRevealLetter,
}) => {
  return (
    <div className="font-mono">
      {words.length > 0 &&
        words.map((word, i) => (
          <div
            key={i}
            className="inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
            style={{ '--animation-delay': `${i * 0.02}s` } as React.CSSProperties}
          >
            <div className="space-x-1 text-base sm:text-2xl md:text-3xl">
              {word.map((letter, j) => (
                <LetterInput
                  key={`${j}${i}`}
                  wordNum={i}
                  letterNum={j}
                  isNonCharacter={!isCharacter(letter, languageToTranslateInto)}
                  onInput={(e) => onInput(e, i, j)}
                  onKeyUp={(e) => onKeyUp(e, i, j)}
                  showBorderOnEmptyInput={showBorderOnEmptyInput}
                  ref={inputRefs[i][j]}
                  correctLetter={letter}
                />
              ))}
            </div>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onRevealLetter(i)}
              className="mt-4 text-xs opacity-40 hover:opacity-100"
            >
              Reveal
            </button>
          </div>
        ))}
    </div>
  );
};

export default SentenceGuesser;