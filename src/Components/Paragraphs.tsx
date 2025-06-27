import React, { useEffect, useRef } from "react";
import Paragraph from "./Paragraph"; // Adjust the import path as needed
import { Language } from "../Utils";

interface ParagraphsProps {
  paragraphData: { sentenceToShow: string; sentenceToGuess: string }[];
  languageToTranslateInto: Language;
}

const Paragraphs: React.FC<ParagraphsProps> = ({ paragraphData, languageToTranslateInto }) => {

    const inputWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Add increasing indexes to all the inputs in a data attribute called input-index
      const inputs = inputWrapperRef.current?.querySelectorAll(
        "input[data-letter-input]"
      ) as NodeListOf<HTMLInputElement>;
  
      inputs.forEach((input, index) => {
        input.setAttribute("data-input-index", index.toString());
      });
  
      //focus first input
      inputs![0]!.focus();
  
    }, [paragraphData, inputWrapperRef]);

  return (
    <div ref={inputWrapperRef}>
      {paragraphData.map((data, index) => (
        <Paragraph
          key={index}
          paragraph={data}
          languageToTranslateInto={languageToTranslateInto}
        />
      ))}
    </div>
  );
};

export default Paragraphs;