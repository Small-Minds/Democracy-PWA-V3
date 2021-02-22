import { cleanup } from '@testing-library/react';
import React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'rsuite';

interface ConfirmModalInput {
  modalTitle: string;
  modalBody: string;
  callBackFunc: any;
  isOpen: boolean;
  closeModal: any;
  expectedResult: any;
  cleanUpFunc: any;
}

export default function ConfirmModal({
  modalTitle,
  modalBody,
  callBackFunc,
  isOpen,
  closeModal,
  cleanUpFunc,
  expectedResult,
}: ConfirmModalInput) {
  return (
    <Modal backdrop="static" show={isOpen} onHide={() => closeModal()}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            closeModal();
            callBackFunc().then((res: any) => {
              if (res == expectedResult) {
                cleanUpFunc();
              } else return;
            });
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
