import * as React from "react";
import { Language } from "../Utils";
import Word from "./Word";
import type { Paragraph } from "./GameView";

interface ISentenceGuesserProps {
  paragraph: Paragraph;
  languageToTranslateInto: Language;
  paragraphIndex: number;
}

const Paragraph: React.FunctionComponent<ISentenceGuesserProps> = ({
  languageToTranslateInto,
  paragraph,
  paragraphIndex,
}) => {
  return (
    <div className="font-mono">
      {paragraph.sentenceToGuess.split(" ").map((letter, i) => (
        <Word
          paragraphIndex={paragraphIndex}
          key={i}
          letters={letter}
          indexes={indexes}
          languageToTranslateInto={languageToTranslateInto}
          animationDelay={`${i * 0.02}s`}
        />
      ))}
    </div>
  );
};

export default Paragraph;
