import * as React from 'react';
import { Language } from '../Utils';
import ActionButtons from './ActionButtons';
import OriginalSentence from './OriginalSentence';
import Paragraph from './Paragraph';

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
  words,
  inputRefs,
  languageToTranslateInto,
  onInput,
  onKeyUp,
  onRevealLetter,
}) => {
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
        words={words}
        inputRefs={inputRefs}
        languageToTranslateInto={languageToTranslateInto}
        showBorderOnEmptyInput={showBorderOnEmptyInput}
        onInput={onInput}
        onKeyUp={onKeyUp}
        onRevealLetter={onRevealLetter}
      />
    </>
  );
};

export default GameView;