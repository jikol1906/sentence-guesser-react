import * as React from "react";
import { Language, isCharacter, removeWordTags } from "../Utils";
import LetterInput from "./LetterInput";
import { useState } from "react";

interface WordProps {
  word: string;
  languageToTranslateInto: Language;
  animationDelay: string;
  wordIsShown?: boolean; // Optional prop to indicate if the word is static
}

const Word = ({
  word,
  languageToTranslateInto,
  animationDelay,
  wordIsShown = false, // Default to false if not provided
} : WordProps) => {
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

  const textClasses = "space-x-1 text-base sm:text-2xl md:text-3xl";

  return (
    <div
      className="font-mono inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
      style={{ "--animation-delay": animationDelay } as React.CSSProperties}
    >
      {!wordIsShown ? (
        <>
          <div className={`flex ${textClasses}`}>
            {removeWordTags(word)
              .split("")
              .map((letter, j) =>
                !isCharacter(letter, languageToTranslateInto) ? (
                  <p key={j}>{letter}</p>
                ) : (
                  <LetterInput
                    key={j}
                    onCorrectLetterEntered={() => updateRevealedIndexes(j)}
                    revealed={revealedIndexes.includes(j)}
                    correctLetter={letter}
                  />
                )
              )}
          </div>
          <button
            onClick={onRevealRandomLetter}
            className="mt-4 text-xs opacity-40 hover:opacity-100"
          >
            Reveal
          </button>
        </>
      ) : (
        <span className={textClasses}>{word}</span>
      )}
    </div>
  );
};

export default Word;
