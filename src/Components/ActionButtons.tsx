import * as React from 'react';
import Button from './Button';
import Switch from './Switch';

interface IActionButtonsProps {
  onRemoveAllWrong: () => void;
  onTryNewSentence: () => void;
  onShowBorderChange: (checked: boolean) => void;
  showBorderOnEmptyInput: boolean;
}

const ActionButtons: React.FunctionComponent<IActionButtonsProps> = ({
  onRemoveAllWrong,
  onTryNewSentence,
  onShowBorderChange,
  showBorderOnEmptyInput,
}) => {
  return (
    <div className="grid md:grid-flow-col gap-4 md:justify-start">
      <Button onClick={onRemoveAllWrong}>Remove all wrong</Button>
      <Button onClick={onTryNewSentence}>Try new sentence</Button>
      <Switch
        checked={showBorderOnEmptyInput}
        onChange={(e) => onShowBorderChange(e.target.checked)}
      >
        Show empty letters
      </Switch>
    </div>
  );
};

export default ActionButtons;