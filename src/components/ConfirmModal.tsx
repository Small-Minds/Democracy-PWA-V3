import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'rsuite';

interface ConfirmModalInput {
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
}: ConfirmModalInput) {
  const [t] = useTranslation();
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
            callBackFunc().then((res: number) => {
              cleanUpFunc(res);
            });
          }}
          appearance="primary"
        >
          {t('confirmModal.okBtn')}
        </Button>
        <Button onClick={() => closeModal()} appearance="default">
          {t('confirmModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
