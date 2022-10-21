import * as React from "react";
import { forwardRef, useState } from "react";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    correctLetter : string;
    wordNum:number;
    letterNum:number;
    handleInput:(e: React.FormEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void;
  }

const LetterInput =  forwardRef<HTMLInputElement,ILetterInputProps>(({correctLetter,wordNum,letterNum,handleInput,...props},ref) => {


  const [enteredLetter, setEnteredLetter] = useState("");

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    setEnteredLetter(e.currentTarget.value)
    handleInput(e,wordNum,letterNum)
  }

  return (
    <input
      type="text"
      autoCorrect="off"
      maxLength={1}
      pattern={correctLetter}
      required
      placeholder="?"
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
      onInput={onInput}
      value={enteredLetter}
    />
  );
});

export default LetterInput;
