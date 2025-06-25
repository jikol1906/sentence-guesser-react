import * as React from 'react';
import { Language } from '../Utils';
import ActionButtons from './ActionButtons';
import OriginalSentence from './OriginalSentence';
import Paragraph from './Paragraph';

export type ParagraphData = {
  sentenceToShow: string;
  sentenceToGuess: string;
};

interface IGameViewProps {
    originalSentence: string;
    words: string[][];
    inputRefs: React.RefObject<HTMLInputElement>[][];
    languageToTranslateInto: Language;
    showBorderOnEmptyInput: boolean;
    onInput: (e: React.FormEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void;
    onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>, wordNum: number, letterNum: number) => void;
    onRevealLetter: (wordNumber: number) => void;
    onRemoveAllWrong: () => void;
    onTryNewSentence: () => void;
    onShowBorderChange: (checked: boolean) => void;
}

const GameView: React.FunctionComponent<IGameViewProps> = ({
  originalSentence,
  onRemoveAllWrong,
  onTryNewSentence,
  onShowBorderChange,
  showBorderOnEmptyInput,
  languageToTranslateInto,
}) => {

    const testData: ParagraphData[] = [
      {
        sentenceToShow: "This is an example sentence.",
        sentenceToGuess: "Dies ist ein Beispielsatz.",
      },
      {
        sentenceToShow: "This is another example.",
        sentenceToGuess: "Dies ist ein weiteres Beispiel.",
      },
    ]

  return (
    <>
      <OriginalSentence originalSentence={originalSentence} />
      <ActionButtons
        onRemoveAllWrong={onRemoveAllWrong}
        onTryNewSentence={onTryNewSentence}
        onShowBorderChange={onShowBorderChange}
        showBorderOnEmptyInput={showBorderOnEmptyInput}
      />
      <Paragraph
        paragraphIndex={0}
        paragraph={testData[0]}
        languageToTranslateInto={languageToTranslateInto}
      />
    </>
  );
};

export default GameView;