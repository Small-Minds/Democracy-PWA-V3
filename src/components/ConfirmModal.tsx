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
  const [success, setSuccess] = useState<boolean>(false);
  if (success) {
    return (
      <Modal
        backdrop="static"
        show={success}
        onHide={() => {
          setSuccess(false);
          cleanUpFunc();
        }}
      >
        <Modal.Header>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Successfully Executed</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setSuccess(false);
              cleanUpFunc();
            }}
            appearance="primary"
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

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
                setSuccess(true);
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
