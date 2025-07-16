import Word from "../Word";
import { WordType } from "../../types";

type ClozeSentenceProps = {
  words: WordType[];
}

const ClozeSentence = ({ words }: ClozeSentenceProps) => {
  return (
    <div
      className="font-mono font-thin flex flex-wrap gap-5 max-w-5xl m-auto text-base sm:text-2xl md:text-3xl"
    >
      {words.map((word, i) => typeof word === 'object' ? (
        <Word
          key={i}
          letters={word.letters}
          shownIndexes={word.shownIndexes}
          animationDelay={`${i * 0.02}s`}
        />
      ) : <span>{word}</span>)}
    </div>
  );
};

export default ClozeSentence;