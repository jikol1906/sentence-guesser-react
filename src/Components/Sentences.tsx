import React, { useEffect, useRef } from "react";
import Sentence from "./Sentence"; // Adjust the import path as needed
import { Language } from "../Utils";

interface ParagraphsProps {
  paragraphData: { sentenceToShow: string; sentenceToGuess: string }[];
  languageToTranslateInto: Language;
}

const Sentences: React.FC<ParagraphsProps> = ({ paragraphData, languageToTranslateInto }) => {

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
        '[data-is-last-paragraph="true"]'
      ) as HTMLDivElement;

      const firstInputInLastParagraph = lastParagraph?.querySelector(
        'input[data-letter-input]'
      ) as HTMLInputElement;

      firstInputInLastParagraph?.focus();
  
    }, [paragraphData, inputWrapperRef]);

  return (
    <div ref={inputWrapperRef}>
      {paragraphData.map((data, index, arr) => (
        <Sentence
          key={index}
          paragraph={data}
          languageToTranslateInto={languageToTranslateInto}
          isLastParagraph={index === arr.length - 1}
        />
      ))}
    </div>
  );
};

export default Sentences;