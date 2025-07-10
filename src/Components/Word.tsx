import * as React from "react";
import LetterInput from "./LetterInput";
import { useState } from "react";

interface WordProps {
  letters: string[];
  shownIndexes: number[];
  animationDelay: string;
  wordIsShown?: boolean; // Optional prop to indicate if the word is static
}

const Word = ({
  letters,
  shownIndexes,
  animationDelay,
  wordIsShown = false, // Default to false if not provided
} : WordProps) => {
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>(shownIndexes);

  const onRevealRandomLetter = () => {

    const indexes: number[] = Array.from({ length: letters.length },(_, index) => index)

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
      className="inline-grid animate-fadeInTop"
      style={{ "--animation-delay": animationDelay } as React.CSSProperties}
    >
      {!wordIsShown ? (
        <>
          <div className={`flex ${textClasses}`}>
            {letters
              .map((letter, j) =>
                shownIndexes.includes(j) ? (
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
        <span className={textClasses}>{letters.join("")}</span>
      )}
    </div>
  );
};

export default Word;
