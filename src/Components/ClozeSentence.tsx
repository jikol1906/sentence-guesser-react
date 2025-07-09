import { useEffect, useRef } from "react";
import Word from "./Word";
import { WordType } from "../types";

type ClozeSentenceProps = {
  words: WordType[];
}

const ClozeSentence = ({ words }: ClozeSentenceProps) => {
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    // Add increasing indexes to all the inputs in a data attribute called input-index
    const inputs = inputWrapperRef.current?.querySelectorAll(
      "input[data-letter-input]"
    ) as NodeListOf<HTMLInputElement>;

    inputs.forEach((input, index) => {
      input.setAttribute("data-input-index", index.toString());
      input.setAttribute("data-cloze-wrapper-id", uniqueId.current);
    });

  }, [words, inputWrapperRef]);

  return (
    <div
      ref={inputWrapperRef}
      data-cloze-id={uniqueId.current} // Add this data attribute
      className="font-mono text-white"
    >
      {words.map(({ letters, shownIndexes, showWord }, i) => (
        <Word
          key={i}
          clozeWrapperId={uniqueId.current}
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