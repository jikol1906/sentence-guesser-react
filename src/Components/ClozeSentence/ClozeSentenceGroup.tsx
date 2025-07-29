import { useEffect, useRef, createContext } from "react";

type ClozeSentenceGroupProps = {
  onLetterEntered: (inputIndex: number, letter: string, sentenceIndex: number) => void;
  onCorrectLetterEntered: (wordIndex: number, letterIndex: number, sentenceIndex: number) => void;
  children: React.ReactNode;
};

export type ClozeSentenceContextType = {
  onLetterEntered: (inputIndex: number, letter: string, sentenceIndex: number) => void;
  onCorrectLetterEntered: (wordIndex: number, letterIndex: number, sentenceIndex: number) => void;
  sentenceIndex?: number;
  wordIndex?: number;
};

export const ClozeSentenceContext = createContext<ClozeSentenceContextType | null>(null);

const ClozeSentenceGroup = ({ children, onLetterEntered, onCorrectLetterEntered }: ClozeSentenceGroupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addIndexToInputs = () => {
      const inputs = containerRef.current?.querySelectorAll(
        "input[data-letter-input]"
      ) as NodeListOf<HTMLInputElement>;

      inputs.forEach((input, index) => {
        input.setAttribute("data-input-index", index.toString());
      });
    };

    const observer = new MutationObserver(() => {
      addIndexToInputs();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Initial call to add indexes
    addIndexToInputs();

    return () => observer.disconnect();
  }, []);

  return ( 
    <ClozeSentenceContext.Provider value={{ onLetterEntered, onCorrectLetterEntered }}>
      <div
        ref={containerRef}
      >
        {children}
      </div>
    </ClozeSentenceContext.Provider>
  );
};

export default ClozeSentenceGroup;
