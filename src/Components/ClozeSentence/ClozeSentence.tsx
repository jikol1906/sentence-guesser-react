import Word from "../Word";
import { WordType } from "../../types";

type ClozeSentenceProps = {
  words: WordType[];
};

const ClozeSentence = ({ words }: ClozeSentenceProps) => {
  return (
    <div className="max-w-[60ch] font-mono font-thin text-base sm:text-2xl md:text-3xl flex flex-wrap gap-2 md:gap-5">
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
  );
};

export default ClozeSentence;
