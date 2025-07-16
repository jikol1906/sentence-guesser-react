import * as React from "react";
import { ClozeSentenceContext, ClozeSentenceContextType } from "./ClozeSentence/ClozeSentenceGroup";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  revealed?: boolean;
  onCorrectLetterEntered: () => void;
  correctLetter: string;
}

const LetterInput = ({
  correctLetter,
  onCorrectLetterEntered,
  revealed = false,
  ...props
}: ILetterInputProps) => {
  const value = revealed ? { value: correctLetter } : {};

  const { onLetterEntered } = React.useContext(ClozeSentenceContext) as ClozeSentenceContextType

  const handleLetterEntered = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;

    if (input.value.toLowerCase() === correctLetter.toLowerCase()) {
      input.disabled = true;
      onCorrectLetterEntered();
    }

    if (input.value.length !== 1 || (e.nativeEvent as InputEvent).isComposing) {
      return;
    }

    onLetterEntered(parseInt(input.getAttribute('data-input-index') || '-1', 10), input.value);

    focusNextAvailableInput(e, 'next');
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (input.value.length === 1) {
      focusNextAvailableInput(e, 'next');
    }
  }

  const getInput = (index: number): HTMLInputElement | null => {
    return document.querySelector(`input[data-input-index="${index}"]`) as HTMLInputElement | null;
  }

  const focusNextAvailableInput = (e: React.SyntheticEvent<HTMLInputElement>, direction: 'next' | 'previous') => {
    const input = e.target as HTMLInputElement;
    const currentIndex = parseInt(input.getAttribute('data-input-index') || '-1', 10);
    let nextInputIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    let nextInput: HTMLInputElement | null;

    while ((nextInput = getInput(nextInputIndex)) !== null) {
      if (!nextInput.disabled) {
        nextInput.focus();
        return; // Found next input in the same sentence
      }
      nextInputIndex = direction === 'next' ? nextInputIndex + 1 : nextInputIndex - 1;
    }
  };

  const handleArrowKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowRight') {
      focusNextAvailableInput(e, 'next');
    } else if (e.key === 'ArrowLeft') {
      focusNextAvailableInput(e, 'previous');
    }
  };

  const handleBackspaceInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") {
      return;
    }

    const currentInput = e.target as HTMLInputElement;

    if (currentInput.value) {
      currentInput.value = ""; // Clear the incorrect letter
      return;
    }
    
    focusNextAvailableInput(e, 'previous');
  };

  const classes = `
    w-[1ch]
    outline-none
    transition-all
    duration-100
    pb-1
    bg-transparent
    rounded-none
    disabled:opacity-100
    placeholder:opacity-[.08]
    border-b-2 
    border-solid
    border-white
    [&:not(:placeholder-shown)]:border-green-500
    [&:not(:placeholder-shown)]:invalid:border-red-500
  `;

  return (
    <input
      maxLength={1}
      pattern={`[${correctLetter.toLowerCase()}${correctLetter.toUpperCase()}]`}
      onInput={handleLetterEntered}
      onKeyDown={(e) => {
        handleBackspaceInput(e)
        handleArrowKeyNavigation(e);
      }}
      onCompositionEnd={handleCompositionEnd}
      data-letter-input
      required
      disabled={revealed}
      className={classes}
      placeholder=" "
      autoCapitalize="off" // Prevent auto capitalize on mobile devices
      type="text"
      autoCorrect="off"
      {...value}
      {...props}
    />
  );
};

export default LetterInput;