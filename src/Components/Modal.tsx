import * as React from 'react';
import ReactModal from 'react-modal'
import Button from './Button';
import { ModalCtx } from './ModalProvider';

interface IModalProps {
}

ReactModal.setAppElement("#root")

const Modal: React.FunctionComponent<IModalProps> = () => {
    const {closeModal, modalContent,modal} = React.useContext(ModalCtx);

  return <ReactModal shouldCloseOnOverlayClick onRequestClose={() => closeModal()} overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center px-4 sm:px-7" className="bg-slate-800 outline-hidden text-white p-5 md:p-8 text-center max-w-5xl rounded-md" isOpen={modal}>
    {modalContent}
    <Button onClick={() => closeModal()}>Close</Button>
  </ReactModal>;
};

export default Modal;