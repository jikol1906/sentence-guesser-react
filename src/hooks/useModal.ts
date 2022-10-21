import React, { ReactElement } from "react";

const  useModal = () => {
  let [modal, setModal] = React.useState(false);
  let [modalContent, setModalContent] = React.useState<ReactElement|null>(null);

  const handleModal = (content:React.ReactElement) => {
      setModal(true)
      setModalContent(content);

  };

  const closeModal = () => {
    setModal(false)
  }

  return { modal, handleModal, modalContent,closeModal };
};


export default useModal