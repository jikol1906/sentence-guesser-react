import * as React from "react";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputIndex: number;
  revealed?: boolean;
  onCorrectLetterEntered: (inputIndex: number) => void;
  isNonCharacter: boolean;
  correctLetter: string;
}

const LetterInput = ({
  correctLetter,
  isNonCharacter,
  inputIndex,
  onCorrectLetterEntered,
  revealed = false, 
  ...props
}: ILetterInputProps) => {



  const value = (isNonCharacter || revealed) ? { value: correctLetter } : {};

  // Advance to the next input when the current input is filled, skipping inputs that already have a letter
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;

    //If correct value was entered, then disable the input
    if (input.value.toLowerCase() === correctLetter.toLowerCase()) {
      input.disabled = true;
      onCorrectLetterEntered(inputIndex);
    }

    if (input.value.length === 1) {
      let nextInputIndex = inputIndex + 1;
      let nextInput: HTMLInputElement | null = null;

      // Find the next input that doesn't already have a letter
      while (
        (nextInput = document.querySelector(
          `input[data-input-index="${nextInputIndex}"]`
        ) as HTMLInputElement | null)
      ) {
        if (!nextInput.value) {
          nextInput.focus();
          break;
        }
        nextInputIndex++;
      }
    }
  };

  // Handle backspace to go back to the previous input and delete the letter in the previous input if present
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") {
      return;
    }

    const currentInput = e.target as HTMLInputElement;

    // If the current input has an incorrect letter, clear it and stop
    if (currentInput.value && currentInput.value !== correctLetter) {
      currentInput.value = ""; // Clear the incorrect letter
      return;
    }

    // Otherwise, move to the previous input
    let previousInputIndex = inputIndex - 1;
    let previousInput: HTMLInputElement | null = null;

    // Find the next available previous input that is not disabled
    while (
      (previousInput = document.querySelector(
        `input[data-input-index="${previousInputIndex}"]`
      ) as HTMLInputElement | null)
    ) {
      if (!previousInput.disabled) {
        previousInput.focus();
        break;
      }
      previousInputIndex--;
    }
  };

  const baseClasses = `
    w-[1ch]
    outline-none
    transition-all
    duration-100
    pb-1
    bg-transparent
    rounded-none
    disabled:opacity-100
    placeholder:opacity-[.08]
  `;

  const characterClasses = `
    border-b-2 
    border-solid
    border-white
    [&:not(:placeholder-shown)]:border-green-500
    [&:not(:placeholder-shown)]:invalid:border-red-500
  `;

  const nonCharacterClasses = "border-none";

  const finalClasses = `
    ${baseClasses}
    ${!isNonCharacter ? characterClasses : nonCharacterClasses}
  `;

  return (
    <input
      maxLength={1}
      pattern={`[${correctLetter.toLowerCase()}${correctLetter.toUpperCase()}]`}
      onInput={handleInputChange} // Handle input change to advance focus
      onKeyDown={handleKeyDown} // Handle backspace to go back
      data-correct-letter={correctLetter}
      data-input-index={inputIndex} // Use data attribute to identify input
      required
      autoFocus={inputIndex === 0} // Autofocus on the first input
      disabled={isNonCharacter || revealed} // Disable input if it's a non-character or already revealed
      {...value} // only show non characters
      className={finalClasses}
      {...props}
    />
  );
};

export default LetterInput;
