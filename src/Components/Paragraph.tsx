import * as React from 'react';
import { Language, isCharacter } from '../Utils';
import LetterInput from './LetterInput';

interface ISentenceGuesserProps {
  lettersAndIndexes: { letters: string[]; indexes: number[] }[];
  languageToTranslateInto: Language;
}

const Paragraph: React.FunctionComponent<ISentenceGuesserProps> = ({
  languageToTranslateInto,
  lettersAndIndexes,
}) => {
  return (
    <div className="font-mono">
      {lettersAndIndexes.map(({letters, indexes}, i) => (
          <div
            key={i}
            className="inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
            style={{ '--animation-delay': `${i * 0.02}s` } as React.CSSProperties}
          >
            <div className="space-x-1 text-base sm:text-2xl md:text-3xl">
              {letters.map((letter, j) => (
                <LetterInput
                  key={indexes[j]}
                  inputIndex={indexes[j]}
                  isNonCharacter={!isCharacter(letter, languageToTranslateInto)}
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
        ))
        }
    </div>
  );
};

export default Paragraph;