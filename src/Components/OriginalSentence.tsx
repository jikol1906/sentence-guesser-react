import * as React from 'react';

interface IOriginalSentenceProps {
  originalSentence: string;
}

const OriginalSentence: React.FunctionComponent<IOriginalSentenceProps> = ({ originalSentence }) => {
  return (
    <div>
      <p className="mb-2 font-bold">You entered the sentence:</p>
      <p className="text-xl sticky top-4 bg-slate-800">{originalSentence}</p>
    </div>
  );
};

export default OriginalSentence;