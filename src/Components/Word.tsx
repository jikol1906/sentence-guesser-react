import * as React from "react";
import { Language, isCharacter } from "../Utils";
import LetterInput from "./LetterInput";
import { useState } from "react";
import { WordWithIndexes } from "./Paragraph";

interface IWordProps {
  paragraphIndex: number;
  wordData: WordWithIndexes;
  languageToTranslateInto: Language;
  animationDelay: string;
}

const Word: React.FunctionComponent<IWordProps> = ({
  wordData : { word, indexes },
  languageToTranslateInto,
  animationDelay,
  paragraphIndex,
}) => {
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);

  const onRevealRandomLetter = () => {
    const unrevealedIndexes = indexes.filter(
      (index) => !revealedIndexes.includes(index)
    );
    if (unrevealedIndexes.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * unrevealedIndexes.length);
    setRevealedIndexes([...revealedIndexes, unrevealedIndexes[randomIndex]]);
  };
    const updateRevealedIndexes = (inputIndex: number) => {
    if (revealedIndexes.includes(inputIndex)) {
      return; // Already revealed
    }
    setRevealedIndexes([...revealedIndexes, inputIndex]);
  };

  return (
    <div
      className="inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
      style={{ "--animation-delay": animationDelay } as React.CSSProperties}
    >
      <div className="space-x-1 text-base sm:text-2xl md:text-3xl">
        {word.map((letter, j) => (
          <LetterInput
            key={indexes[j]}
            paragraphIndex={paragraphIndex}
            onCorrectLetterEntered={(inputIndex: number) =>
              updateRevealedIndexes(inputIndex)
            }
            revealed={revealedIndexes.includes(indexes[j])}
            inputIndex={indexes[j]}
            isNonCharacter={!isCharacter(letter, languageToTranslateInto)}
            correctLetter={letter}
            placeholder=" "
            autoCapitalize="off" // Prevent auto capitalize on mobile devices
            type="text"
            autoCorrect="off"
          />
        ))}
      </div>
      <button
        onClick={onRevealRandomLetter}
        className="mt-4 text-xs opacity-40 hover:opacity-100"
      >
        Reveal
      </button>
    </div>
  );
};

export default Word;
