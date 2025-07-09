import * as React from "react";

interface ILetterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  revealed?: boolean;
  clozeWrapperId: string;
  onCorrectLetterEntered: () => void;
  correctLetter: string;
}

const LetterInput = ({
  correctLetter,
  onCorrectLetterEntered,
  clozeWrapperId,
  revealed = false,
  ...props
}: ILetterInputProps) => {
  const value = revealed ? { value: correctLetter } : {};

  const handleLetterEntered = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;

    if (input.value.toLowerCase() === correctLetter.toLowerCase()) {
      input.disabled = true;
      onCorrectLetterEntered();
    }

    if (input.value.length !== 1 || (e.nativeEvent as InputEvent).isComposing) {
      return;
    }

    focusNextAvailableInput(e, 'next');
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (input.value.length === 1) {
      focusNextAvailableInput(e, 'next');
    }
  }

  const getInput = (clozeWrapperId: string, index: number): HTMLInputElement | null => {
    return document.querySelector(`input[data-input-index="${index}"][data-cloze-wrapper-id="${clozeWrapperId}"]`) as HTMLInputElement | null;
  }

  const focusNextAvailableInput = (e: React.SyntheticEvent<HTMLInputElement>, direction: 'next' | 'previous') => {
    const input = e.target as HTMLInputElement;
    const currentIndex = parseInt(input.getAttribute('data-input-index') || '-1', 10);
    let nextInputIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    let nextInput: HTMLInputElement | null;

    while ((nextInput = getInput(clozeWrapperId, nextInputIndex)) !== null) {
      if (!nextInput.disabled) {
        nextInput.focus();
        return; // Found next input in the same sentence
      }
      nextInputIndex = direction === 'next' ? nextInputIndex + 1 : nextInputIndex - 1;
    }

    // If no next input is found in the current sentence and moving forward
    if (direction === 'next') {
      const currentClozeContainer = document.querySelector(`div[data-cloze-id="${clozeWrapperId}"]`);
      let nextClozeContainer = currentClozeContainer?.nextElementSibling;

      // Find the next sibling that is a cloze container
      while(nextClozeContainer && !nextClozeContainer.hasAttribute('data-cloze-id')) {
        nextClozeContainer = nextClozeContainer.nextElementSibling;
      }

      if (nextClozeContainer) {
        const firstInputOfNext = nextClozeContainer.querySelector('input[data-letter-input]:not(:disabled)') as HTMLInputElement | null;
        if (firstInputOfNext) {
          firstInputOfNext.focus();
        }
      }
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
    const currentIndex = parseInt(currentInput.getAttribute("data-input-index") || "-1", 10);

    if (currentInput.value) {
      currentInput.value = ""; // Clear the incorrect letter
      return;
    }

    // If backspace is pressed on an empty input, move to the previous one
    if (currentIndex > 0) {
      let previousInputIndex = currentIndex - 1;
      let previousInput: HTMLInputElement | null = null;

      while ((previousInput = getInput(clozeWrapperId, previousInputIndex)) !== null && previousInputIndex >= 0) {
        if (!previousInput.disabled) {
          previousInput.focus();
          break;
        }
        previousInputIndex--;
      }
    } else { // At the first input of the sentence, try to jump to the previous sentence
      const currentClozeContainer = document.querySelector(`div[data-cloze-id="${clozeWrapperId}"]`);
      let prevClozeContainer = currentClozeContainer?.previousElementSibling;
      
      // Find the previous sibling that is a cloze container
      while(prevClozeContainer && !prevClozeContainer.hasAttribute('data-cloze-id')) {
        prevClozeContainer = prevClozeContainer.previousElementSibling;
      }

      if (prevClozeContainer) {
        const inputsInPrev = prevClozeContainer.querySelectorAll('input[data-letter-input]:not(:disabled)');
        if (inputsInPrev.length > 0) {
          const lastInputOfPrev = inputsInPrev[inputsInPrev.length - 1] as HTMLInputElement;
          lastInputOfPrev.focus();
        }
      }
    }
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
      data-correct-letter={correctLetter}
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