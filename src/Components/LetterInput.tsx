import * as React from "react";
import { forwardRef } from "react";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    inputIndex: number
    isNonCharacter: boolean
    correctLetter: string
  }

const LetterInput =  forwardRef<HTMLInputElement,ILetterInputProps>(  (
  {
    correctLetter,
    isNonCharacter,
    inputIndex,
    ...props
  },
  ref
) => {

  const value = isNonCharacter ?  {
    value:correctLetter
  } : {}

  return (
    <input
      type="text"
      autoCorrect="off"
      maxLength={1}
      pattern={`[${correctLetter.toLowerCase()}${correctLetter.toUpperCase()}]`}
      data-correct-letter={correctLetter}
      required
      autoFocus={inputIndex === 0} // Autofocus on the first input
      placeholder=" "
      autoCapitalize="off" //Prevent auto capitalize on mobile devices
      ref={ref}
      disabled={isNonCharacter}
      {...value} // only show non characters
      className={
        `w-[1ch]
        outline-none
        transition-all
        duration-100
        pb-1
        bg-transparent
        rounded-none
        disabled:opacity-100
        placeholder:opacity-[.08]
        ${!isNonCharacter ? `
        border-b-2 
        border-solid
        border-white
        [&:not(:placeholder-shown)]:border-green-500
        [&:not(:placeholder-shown)]:invalid:border-red-500`
        : 
        "border-none"
        }
        `}
      {...props}

    />
  );
});

export default LetterInput;
