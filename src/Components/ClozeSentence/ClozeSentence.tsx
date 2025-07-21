import Word from "../Word";
import { WordType } from "../../types";
import Button from "../Button";
import { useState } from "react";

type ClozeSentenceProps = {
  words: WordType[];
  onRevealLetter: (wordIndex: number) => void;
};

const ClozeSentence = ({ words, onRevealLetter }: ClozeSentenceProps) => {
  return (
    <div className="max-w-[60ch] text-base sm:text-2xl md:text-3xl grid gap-11">
      <div className="font-mono font-thin flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-4 sm:gap-y-4">
        {words.map((word, i) =>
          typeof word === "object" ? (
            <Word
              key={i}
              letters={word.letters}
              shownIndexes={word.shownIndexes}
              animationDelay={`${i * 0.02}s`}
            />
          ) : (
            <span
              className="animate-fadeInTop"
              style={
                { "--animation-delay": `${i * 0.02}s` } as React.CSSProperties
              }
              key={i}
            >
              {word}
            </span>
          )
        )}
      </div>
      <div className="text-lg flex-row flex gap-4">
        {words
          .filter((word) => typeof word === "object")
          .map((_, i) => (
            <Button onClick={() => onRevealLetter(i)}>
              Reveal letter in word {i+1}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default ClozeSentence;
