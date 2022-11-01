import * as React from "react";
import { isCharacter, Language, randomIntFromInterval } from "../Utils";
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

    /**
   * Reveals one random letter of the specified word
   * @param wordNumber - index of the word which will have one letter revealed.
   */
     const revealRandLetter = () => { 
    
      const inputsWithWrongLetters = letterRefs.filter(i => !i.current!.checkValidity())
      if(inputsWithWrongLetters.length > 0) {
        const inputToReveal = inputsWithWrongLetters[randomIntFromInterval(0,inputsWithWrongLetters.length-1)]
        inputToReveal.current!.value = inputToReveal.current!.getAttribute("data-correct-letter")!
        inputToReveal.current!.disabled = true;
        if(document.activeElement === inputToReveal.current) {
          inputToReveal.current!.blur()
        }
      }
  
    }


  return (
    <div
      className="inline-grid pb-3 pr-3 md:pb-7 md:pr-10 animate-fadeInTop"
      style={
        { "--animation-delay": `${wordNum * 0.02}s` } as React.CSSProperties
      }
    >
      <div data-test-letterinputcontainer={wordNum} className="space-x-1 text-base sm:text-2xl md:text-3xl">
        {word.map((s, i) => (
          <LetterInput
            key={i} //Should be ok to use indexes as keys since order of inputs doesn't change
            autoFocus={wordNum === 0 && i === 0}
            data-letter-input={`${wordNum}${i}`}
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
        data-test-reavealbutton={wordNum}
        onClick={revealRandLetter}
        className="mt-4 text-xs opacity-40 hover:opacity-100"
      >
        Reveal
      </button>
    </div>
  );
};  

export default Word;
