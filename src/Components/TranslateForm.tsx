import * as React from "react";
import { Updater } from "use-immer";
import { SentenceGuesserConfig } from "../Utils";
import Button from "./Button";
import { ModalCtx } from "./ModalProvider";
import Switch from "./Switch";

interface ITranslateFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
    setSentenceGuesserConfig:Updater<SentenceGuesserConfig>
    showBorderOnEmptyInput:boolean
  }

const TranslateForm: React.FunctionComponent<ITranslateFormProps> = ({
  setSentenceGuesserConfig,
  showBorderOnEmptyInput,
  onSubmit,
}) => {

    const {handleModal} = React.useContext(ModalCtx)

    const onHelpClicked = () => {
        handleModal(
          <div className="space-y-4 mb-4">
            <p>
              Sentence Guesser works by taking an English sentence that you provide,
              translating it to German with DeepL, then returning it to you in the
              form of a fill-in-the-blanks exercise. If you get stuck, you can
              reveal a single letter every time you press "reveal" under a word.
            </p>
            <p>
              Try to enter a sentence and see if you can fill in the missing letters
              yourself!
            </p>
          </div>
        );
      }

  return (
    <form onSubmit={onSubmit} className="space-y-8 grid">
      <input
        required
        placeholder="Enter sentence to translate..."
        className="p-2 w-full outline-none bg-transparent m-auto border-b-2 rounded-none"
        type="text"
        name="test"
        id=""
        autoFocus={true}
      />
      <div className="grid md:grid-flow-col gap-4 md:justify-self-center">
        <Button type="submit">Translate sentence</Button>
        <Button type="button" onClick={onHelpClicked}>Help</Button>
        <Switch checked={showBorderOnEmptyInput} onChange={_ => setSentenceGuesserConfig(prev => {prev.showBorderOnEmptyInput = !prev.showBorderOnEmptyInput})}>Show empty letters</Switch>
      </div>
    </form>
  );
};

export default TranslateForm;
