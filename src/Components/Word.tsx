import * as React from "react";
import { isCharacter, Language } from "../Utils";
import LetterInput from "./LetterInput";

interface IWordProps {
  wordNum: number;
  languageToTranslateInto:Language;
  showBorderOnEmptyInput:boolean
  word:string[]
  letterRefs: React.RefObject<HTMLInputElement>[];
  onLetterInput: (e: React.FormEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void;
  onLetterKeyUp: (e: React.KeyboardEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void
}

const Word: React.FunctionComponent<IWordProps> = ({
  wordNum,
  onLetterInput,
  onLetterKeyUp,
  languageToTranslateInto,
  showBorderOnEmptyInput,
  word,
  letterRefs
}) => {

  return (
    <div
      className="inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
      style={
        { "--animation-delay": `${wordNum * 0.02}s` } as React.CSSProperties
      }
    >
      <div className="space-x-1 text-base sm:text-2xl md:text-3xl">
        {word.map((s, i) => (
          <LetterInput
            key={i} //Should be ok to use indexes as keys since order of inputs doesn't change
            autoFocus={wordNum === 0 && i === 0}
            isNonCharacter={!isCharacter(s, languageToTranslateInto)}
            onInput={(e) => onLetterInput(e, wordNum, i)}
            onKeyUp={(e) => onLetterKeyUp(e, wordNum, i)}
            showBorderOnEmptyInput={showBorderOnEmptyInput}
            ref={letterRefs[i]} //Add inputref to each individual input
            correctLetter={s}
          />
        ))}
      </div>
      <button
        onMouseDown={(e) => e.preventDefault()}
        className="mt-4 text-xs opacity-40 hover:opacity-100"
      >
        Reveal
      </button>
    </div>
  );
};  

export default Word;
