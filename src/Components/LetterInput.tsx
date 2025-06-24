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

  // handle backspace to go back to the previous input and delete letter in the previous input if present
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key !== "Backspace") {
      return;
    }

    const previousInput = document.querySelector(
        `input[data-input-index="${inputIndex - 1}"]`
    ) as HTMLInputElement | null;

    if(previousInput?.disabled) {
      return; // Don't allow backspace if the previous input is disabled
    }

    if (previousInput) {
      previousInput.focus();
      previousInput.value = ""; // Clear the previous input
    }
  };

  return (
    <input
      type="text"
      autoCorrect="off"
      maxLength={1}
      pattern={`[${correctLetter.toLowerCase()}${correctLetter.toUpperCase()}]`}
      onInput={handleInputChange} // Handle input change to advance focus
      onKeyDown={handleKeyDown} // Handle backspace to go back
      data-correct-letter={correctLetter}
      data-input-index={inputIndex} // Use data attribute to identify input
      required
      autoFocus={inputIndex === 0} // Autofocus on the first input
      placeholder=" "
      autoCapitalize="off" // Prevent auto capitalize on mobile devices
      disabled={isNonCharacter || revealed} // Disable input if it's a non-character or already revealed
      {...value} // only show non characters
      className={`
        w-[1ch]
        outline-none
        transition-all
        duration-100
        pb-1
        bg-transparent
        rounded-none
        disabled:opacity-100
        placeholder:opacity-[.08]
        ${
          !isNonCharacter
            ? `
        border-b-2 
        border-solid
        border-white
        [&:not(:placeholder-shown)]:border-green-500
        [&:not(:placeholder-shown)]:invalid:border-red-500`
            : "border-none"
        }
      `}
      {...props}
    />
  );
};

export default LetterInput;
