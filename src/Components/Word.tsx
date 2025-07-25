import * as React from "react";
import LetterInput from "./LetterInput";
import {isCharacter} from "../Utils";

interface WordProps {
  letters: string[];
  shownIndexes: number[];
  animationDelay: string;
}

const Word = ({ letters, shownIndexes, animationDelay }: WordProps) => {
  const classes = `
   grid
   animate-fadeInTop 
   justify-items-center 
   relative 
  `;

  const letterWrapperClasses = `
  relative 
  after:absolute 
  after:bg-slate-100 
  after:h-[1px] 
  after:w-full 
  after:-bottom-1 md:after:-bottom-2 
  after:left-0
  has-[:not(:placeholder-shown)]:after:bg-green-500
  has-[:not(:placeholder-shown):invalid]:after:bg-red-500
`.replace(/\s+/g, " ");

  const renderLetter = (letter: string, index: number) => {
    if (!isCharacter(letter, "german")) {
      return letter;
    }

    return (
      <span className={letterWrapperClasses}>
        {shownIndexes.includes(index) ? (
          <span key={index}>{letter}</span>
        ) : (
          <LetterInput
            key={index}
            revealed={shownIndexes.includes(index)}
            correctLetter={letter}
          />
        )}
      </span>
    );
  };

  return (
    <div
      className={classes}
      style={{ "--animation-delay": animationDelay } as React.CSSProperties}
    >
      <div className="flex gap-1">{letters.map(renderLetter)}</div>
    </div>
  );
};

export default Word;
