import * as React from "react";
import { forwardRef, useState } from "react";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    correctLetter : string;
    wordNum:number;
    letterNum:number;
  }

const LetterInput =  forwardRef<HTMLInputElement,ILetterInputProps>(({correctLetter,wordNum,letterNum,...props},ref) => {

  return (
    <input
      type="text"
      autoCorrect="off"
      maxLength={1}
      pattern={`[${correctLetter.toLowerCase()}${correctLetter.toUpperCase()}]`}
      data-correct-letter={correctLetter}
      required
      autoFocus={wordNum === 0 && letterNum === 0} //Autofocus first letter input
      placeholder=" "
      autoCapitalize="off" //Prevent auto capitalize on mobile devices
      ref={ref}
      className={
        `w-[1ch]
        outline-none
        pb-1
        bg-transparent
        rounded-none
        disabled:opacity-100
        placeholder:opacity-[.08]
        border-b-2 border-solid
      border-white
      [&:not(:placeholder-shown)]:border-green-500
      [&:not(:placeholder-shown)]:invalid:border-red-500`}
      {...props}

    />
  );
});

export default LetterInput;
