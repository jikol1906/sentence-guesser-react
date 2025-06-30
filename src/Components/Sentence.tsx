import * as React from "react";
import { Language } from "../Utils";
import Word from "./Word";
import type { ParagraphData } from "./GameView";

interface ParagraphProps {
  paragraph: ParagraphData;
  languageToTranslateInto: Language;
  isLastParagraph?: boolean;
}

const Sentence: React.FunctionComponent<ParagraphProps> = ({
  languageToTranslateInto,
  paragraph,
  isLastParagraph
}) => {

  return (
    <div className="space-y-8" data-is-last-paragraph={isLastParagraph}>
      <div className="sticky text-lg top-7 mb-7 p-4 bg-slate-600 z-10 rounded-md">
        <p>{paragraph.sentenceToShow}</p>
      </div>
      {paragraph.sentenceToGuess.split(" ").map((word, i) => (
        <Word
          key={i}
          word={word}
          languageToTranslateInto={languageToTranslateInto}
          animationDelay={`${i * 0.02}s`}
          
        />
      ))}
    </div>
  );
};

export default Sentence;