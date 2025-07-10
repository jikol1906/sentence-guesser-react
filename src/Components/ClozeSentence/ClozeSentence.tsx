import { useEffect, useRef } from "react";
import Word from "../Word";
import { WordType } from "../../types";

type ClozeSentenceProps = {
  words: WordType[];
}

const ClozeSentence = ({ words }: ClozeSentenceProps) => {
  return (
    <div
      className="font-mono text-white flex flex-wrap gap-5"
    >
      {words.map(({ letters, shownIndexes, showWord }, i) => (
        <Word
          key={i}
          letters={letters}
          shownIndexes={shownIndexes}
          animationDelay={`${i * 0.02}s`}
          wordIsShown={showWord}
        />
      ))}
    </div>
  );
};

export default ClozeSentence;