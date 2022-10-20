import * as React from 'react';
import ReactModal from 'react-modal'
import Button from './Button';
import { ModalCtx } from './ModalProvider';

interface IModalProps {
}

ReactModal.setAppElement("#root")

const Modal: React.FunctionComponent<IModalProps> = () => {
    const {closeModal, modalContent,modal} = React.useContext(ModalCtx);

  return <ReactModal shouldCloseOnOverlayClick onRequestClose={() => closeModal()} overlayClassName="fixed inset-0 bg-black/75" className="bg-slate-800 absolute outline-none inset-x-11 md:inset-x-60 top-1/2 -translate-y-1/2 text-white p-8 text-center rounded-md" isOpen={modal}>
    {modalContent}
    <Button onClick={() => closeModal()}>Close</Button>
  </ReactModal>;
};

export default Modal;