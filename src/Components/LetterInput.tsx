import * as React from "react";
import { forwardRef } from "react";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    correctLetter : string;
  }

const LetterInput =  forwardRef<HTMLInputElement,ILetterInputProps>((props,ref) => {
  return (
    <input
      type="text"
      autoCorrect="off"
      maxLength={1}
      autoCapitalize="off" //Prevent auto capitalize on mobile devices
      ref={ref}
      {...props}
    />
  );
});

export default LetterInput;
