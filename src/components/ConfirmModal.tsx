import React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'rsuite';

interface ModalInput {
    modalTitle: string;
    modalBody: string;
    callBackFunc: Function;
}

export default function ConfirmModal({modalTitle,modalBody,callBackFunc}:ModalInput) {
    const [open, setOpen] = useState(false)
  
  return (
    <Modal backdrop={false} show={open} onHide={()=>setOpen(false)}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {modalBody}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={()=>callBackFunc} appearance="primary">
          Ok
        </Button>
        <Button onClick={()=>setOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
