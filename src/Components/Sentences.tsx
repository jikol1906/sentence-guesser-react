import { useEffect, useRef } from "react";
import Sentence from "./Sentence"; // Adjust the import path as needed
import { Language, removeWordTags } from "../Utils";
import type { SentenceData } from "./App";

interface SentencesProps {
  sentences: SentenceData[];
  languageToTranslateInto: Language;
  guessOnlyWordMode?: boolean;
}

const Sentences = ({ 
  sentences, 
  languageToTranslateInto,
  guessOnlyWordMode = false
} : SentencesProps) => {

    const inputWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Add increasing indexes to all the inputs in a data attribute called input-index
      const inputs = inputWrapperRef.current?.querySelectorAll(
        "input[data-letter-input]"
      ) as NodeListOf<HTMLInputElement>;
  
      inputs.forEach((input, index) => {
        input.setAttribute("data-input-index", index.toString());
      });
      
      const lastParagraph = inputWrapperRef.current?.querySelector(
        '[data-is-last-sentence="true"]'
      ) as HTMLDivElement;

      const firstInputInLastParagraph = lastParagraph?.querySelector(
        'input[data-letter-input]'
      ) as HTMLInputElement;

      firstInputInLastParagraph?.focus();
  
    }, [sentences, inputWrapperRef]);

  return (
    <div ref={inputWrapperRef}>
      {sentences.map((data, index, arr) => (
        <Sentence
          key={index}
          sentence={data}
          guessOnlyWordMode={guessOnlyWordMode}
          languageToTranslateInto={languageToTranslateInto}
          isLastSentence={index === arr.length - 1}
        />
      ))}
    </div>
  );
};

export default Sentences;