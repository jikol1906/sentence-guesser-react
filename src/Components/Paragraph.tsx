import * as React from "react";
import { Language } from "../Utils";
import Word from "./Word";
import type { ParagraphData } from "./GameView";

interface ISentenceGuesserProps {
  paragraph: ParagraphData;
  languageToTranslateInto: Language;
  paragraphIndex: number;
}

export type WordWithIndexes = {
  word: string[];
  indexes: number[];
}

/**
 * Converts a sentence into an array of words, where each word is represented as an object
 * containing its characters split into an array and an array of indexes. The indexes go from 0-n where n is the total length of the sentence
 * @param sentence The sentence to convert
 * @return An array of objects, each containing a word and its indexes
 * */
const convertSentenceToGuess = (sentence: string): WordWithIndexes[] => {
  let currIndex = 0;
  return sentence.split(" ").map((word) => {
    const wordData: WordWithIndexes = {
      word: [...word],
      indexes: Array.from({ length: word.length }, (_, i) => currIndex + i),
    };
    currIndex += word.length
    return wordData;
  });
}

const Paragraph: React.FunctionComponent<ISentenceGuesserProps> = ({
  languageToTranslateInto,
  paragraph,
  paragraphIndex,
}) => {
  return (
    <div className="font-mono">
      {convertSentenceToGuess(paragraph.sentenceToGuess).map((wordData, i) => (
        <Word
          key={i}
          paragraphIndex={paragraphIndex}
          wordData={wordData}
          languageToTranslateInto={languageToTranslateInto}
          animationDelay={`${i * 0.02}s`}
        />
      ))}
    </div>
  );
};

export default Paragraph;
