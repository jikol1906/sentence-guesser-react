import * as React from "react";
import { Language } from "../Utils";
import Word from "./Word";
import type { ParagraphData } from "./GameView";

interface ISentenceGuesserProps {
  paragraph: ParagraphData;
  languageToTranslateInto: Language;
  paragraphIndex: number;
}

const Paragraph: React.FunctionComponent<ISentenceGuesserProps> = ({
  languageToTranslateInto,
  paragraph,
  paragraphIndex,
}) => {

  return (
    <div className="space-y-8">
      <div className="sticky text-lg top-7 mb-7 p-4 bg-slate-600 z-10 rounded-md">
        <p>{paragraph.sentenceToShow}</p>
      </div>
      {paragraph.sentenceToGuess.split(" ").map((word, i) => (
        <Word
          key={i}
          paragraphIndex={paragraphIndex}
          word={word}
          languageToTranslateInto={languageToTranslateInto}
          animationDelay={`${i * 0.02}s`}
          
        />
      ))}
    </div>
  );
};

export default Paragraph;