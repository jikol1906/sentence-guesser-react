import * as React from "react";
import { forwardRef } from "react";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    correctLetter : string;
    wordNum:number;
    letterNum:number;
    handleInput:(e: React.FormEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void;
  }


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
      autoCapitalize="off" //Prevent auto capitalize on mobile devices
      ref={ref}
      {...props}
      onInput={onInput}
      value={enteredLetter}
    />
  );
});

export default LetterInput;
