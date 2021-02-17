import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'rsuite';

interface ModalInput {
  modalTitle: string;
  modalBody: string;
  callBackFunc: any;
  isOpen: boolean;
  closeModal: any;
  redirectPath: string;
}

export default function ConfirmModal({
  modalTitle,
  modalBody,
  callBackFunc,
  isOpen,
  closeModal,
  redirectPath,
}: ModalInput) {
  const history = useHistory();

  return (
    <Modal backdrop={false} show={isOpen} onHide={() => closeModal()}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            callBackFunc()
              .then(() => {
                closeModal();
              })
              .then(() => {
                history.push(redirectPath);
              });
            closeModal();
          }}
          appearance="primary"
        >
          Ok
        </Button>
        <Button onClick={() => closeModal()} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
