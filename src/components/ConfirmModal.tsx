import React from 'react';
import { Modal, Button } from 'rsuite';

interface ModalInput {
  modalTitle: string;
  modalBody: string;
  callBackFunc: any;
  isOpen: boolean;
  closeModal: any;
  cleanUpFunc: any;
}

export default function ConfirmModal({
  modalTitle,
  modalBody,
  callBackFunc,
  isOpen,
  closeModal,
  cleanUpFunc,
}: ModalInput) {
  return (
    <Modal backdrop="static" show={isOpen} onHide={() => closeModal()}>
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
                cleanUpFunc();
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
