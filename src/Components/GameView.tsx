import * as React from 'react';
import { Language } from '../Utils';
import ActionButtons from './ActionButtons';
import OriginalSentence from './OriginalSentence';
import SentenceGuesser from './SentenceGuesser';

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

const GameView: React.FunctionComponent<IGameViewProps> = (props) => {
  return (
    <>
      <OriginalSentence originalSentence={props.originalSentence} />
      <ActionButtons
        onRemoveAllWrong={props.onRemoveAllWrong}
        onTryNewSentence={props.onTryNewSentence}
        onShowBorderChange={props.onShowBorderChange}
        showBorderOnEmptyInput={props.showBorderOnEmptyInput}
      />
      <SentenceGuesser
        words={props.words}
        inputRefs={props.inputRefs}
        languageToTranslateInto={props.languageToTranslateInto}
        showBorderOnEmptyInput={props.showBorderOnEmptyInput}
        onInput={props.onInput}
        onKeyUp={props.onKeyUp}
        onRevealLetter={props.onRevealLetter}
      />
    </>
  );
};

export default GameView;