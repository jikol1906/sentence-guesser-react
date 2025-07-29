import Word from "../Word";
import { WordType } from "../../types";
import React from "react";
import { ClozeSentenceContext, ClozeSentenceContextType } from "./ClozeSentenceGroup";

type ClozeSentenceProps = {
  words: WordType[];
  sentenceIndex?: number;
};

const ClozeSentence = ({ words, sentenceIndex }: ClozeSentenceProps) => {

  const context = React.useContext(ClozeSentenceContext) as ClozeSentenceContextType

  return (
    <div className="max-w-[60ch] text-base sm:text-2xl md:text-3xl font-mono font-thin flex flex-wrap gap-x-2 gap-y-2 sm:gap-4">
      {words.map((word, i) =>
        typeof word === "object" ? (
          <ClozeSentenceContext.Provider value={{...context, sentenceIndex, wordIndex: i}}>
            <Word
              key={i}
              letters={word.letters}
              shownIndexes={word.shownIndexes}
              animationDelay={`${i * 0.02}s`}
            />
          </ClozeSentenceContext.Provider>
        ) : (
          <span
            className="animate-fade-in-top"
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
  );
};

export default ClozeSentence;
