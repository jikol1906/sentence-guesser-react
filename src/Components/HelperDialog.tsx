import * as React from "react";
import Button from "./Button";
import Modal from 'react-modal'

interface IHelperDialogProps {
  isOpen: boolean;
  onCloseClicked : React.Dispatch<React.SetStateAction<boolean>>;
}

Modal.setAppElement("#root")

const HelperDialog: React.FunctionComponent<IHelperDialogProps> = ({
  children,
  isOpen,
  onCloseClicked
}) => {

    

    

  return (
    <Modal overlayClassName="fixed inset-0 bg-black/75" isOpen={isOpen} className="bg-blue-800 absolute md:inset-x-60 top-1/2 -translate-y-1/2 text-white p-8 text-center rounded-md">
        <div className="space-y-8">
        {children}
        <Button onClick={_ => onCloseClicked(false)}>Close</Button>
        </div>
    </Modal>
  );
};

export default HelperDialog;
