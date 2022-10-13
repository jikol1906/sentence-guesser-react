import * as React from "react";
import Button from "./Button";
import Modal from 'react-modal'

interface IHelperDialogProps {
  isOpen: boolean;
}

Modal.setAppElement("#root")

const HelperDialog: React.FunctionComponent<IHelperDialogProps> = ({
  children,
  isOpen,
  
}) => {

    const [opened,setOpened] = React.useState(isOpen)

    

  return (
    <Modal overlayClassName="fixed inset-0 bg-black/75" isOpen={opened} className="bg-slate-800 absolute outline-none inset-x-11 md:inset-x-60 top-1/2 -translate-y-1/2 text-white p-8 text-center rounded-md">
        <div className="space-y-8">
        {children}
        <Button onClick={() => setOpened(false)}>Close</Button>
        </div>
    </Modal>
  );
};

export default HelperDialog;
