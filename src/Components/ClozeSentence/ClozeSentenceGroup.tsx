import { useEffect, useRef } from "react";

type ClozeSentenceGroupProps = {
  children: React.ReactNode;
};

const ClozeSentenceGroup = ({ children }: ClozeSentenceGroupProps) => {
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

  return <div ref={containerRef}>{children}</div>;
};

export default ClozeSentenceGroup;
