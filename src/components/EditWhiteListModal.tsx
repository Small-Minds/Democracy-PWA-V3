import React from 'react';
import { Button, Input, Modal } from 'rsuite';

interface EditWhiteListModalInput {
  closeModal: () => void;
  isOpen: boolean;
  electionId: string;
}

export default function EditWhiteListModal({
  closeModal,
  isOpen,
  electionId,
}: EditWhiteListModalInput) {
  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="lg"
    >
      <Modal.Header>
        <Modal.Title>
          <h5>Edit Whitelist</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input componentClass="textarea" rows={100} placeholder="Textarea" />
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary">Submit</Button>
        <Button appearance="default" onClick={() => closeModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
