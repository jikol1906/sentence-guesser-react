import * as React from "react";
import LetterInput from "./LetterInput";
import { useState } from "react";

interface WordProps {
  letters: string[];
  shownIndexes: number[];
  animationDelay: string;
}

const Word = ({ letters, shownIndexes, animationDelay }: WordProps) => {
  const [revealedIndexes, setRevealedIndexes] =
    useState<number[]>(shownIndexes);

  const onRevealRandomLetter = () => {
    const indexes: number[] = Array.from(
      { length: letters.length },
      (_, index) => index
    );

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
      className="inline-grid animate-fadeInTop justify-items-center"
      style={{ "--animation-delay": animationDelay } as React.CSSProperties}
    >
      <div className="flex gap-1">
        {letters.map((letter, j) =>
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
        className="mt-4 px-[1em] font-normal py-[0.15em] bg-secondary text-[.4rem] md:text-sm rounded-full"
      >
        Show one
      </button>
    </div>
  );
};

export default Word;
