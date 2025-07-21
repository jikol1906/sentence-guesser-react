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

  const classes = `
   grid
   animate-fadeInTop 
   justify-items-center 
   relative 
  `

  return (
    <div
      className={classes}
      style={{ "--animation-delay": animationDelay } as React.CSSProperties}
    >
      <div className="flex gap-1">
        {letters.map((letter, j) =>
          shownIndexes.includes(j) ? (
            <span className="border-b-2" key={j}>{letter}</span>
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
    </div>
  );
};

export default Word;
