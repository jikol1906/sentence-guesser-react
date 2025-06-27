import * as React from "react";
import { Language, isCharacter } from "../Utils";
import LetterInput from "./LetterInput";
import { useState } from "react";

interface IWordProps {
  word: string;
  languageToTranslateInto: Language;
  animationDelay: string;
}

const Word: React.FunctionComponent<IWordProps> = ({
  word,
  languageToTranslateInto,
  animationDelay,
}) => {
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);

  const onRevealRandomLetter = () => {

    const indexes: number[] = Array.from({ length: word.length },(_, index) => index)
      .filter((index) => isCharacter(word[index], languageToTranslateInto));
    const unrevealedIndexes = indexes.filter((index) => !revealedIndexes.includes(index));

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
      className="font-mono inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
      style={{ "--animation-delay": animationDelay } as React.CSSProperties}
    >
      <div className="space-x-1 text-base sm:text-2xl md:text-3xl flex">
        {word.split("").map((letter, j) => !isCharacter(letter, languageToTranslateInto) ? <p>{letter}</p> : (
          <LetterInput
            key={j}
            onCorrectLetterEntered={() => updateRevealedIndexes(j)}
            revealed={revealedIndexes.includes(j)}
            correctLetter={letter}
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
