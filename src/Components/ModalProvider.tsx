import * as React from "react";
import { createContext } from "react";
import useModal from "../hooks/useModal";
import Modal from "./Modal";

export interface IModalContext {
  modal:boolean;
  modalContent: React.ReactElement | null;
  handleModal:((content: React.ReactElement) => void);
  closeModal:() => void;
}

const ModalCtx = createContext({} as IModalContext);



interface IModalProviderProps {}

const ModalProvider: React.FunctionComponent<IModalProviderProps> = ({
  children,
}) => {

  const { modal, handleModal, modalContent,closeModal } = useModal();

  return (
    <ModalCtx.Provider value={{closeModal, handleModal,modal,modalContent}}>
      <Modal />
      {children}
    </ModalCtx.Provider>
  );
};

export { ModalProvider, ModalCtx };
