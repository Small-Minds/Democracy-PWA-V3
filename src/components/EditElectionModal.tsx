import React, { useState } from 'react';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Schema,
  Notification,
} from 'rsuite';
import {
  ElectionDetails,
  updateOldElection,
} from '../utils/api/ElectionManagement';

interface EditElectionModalInput {
  closeModal: () => void;
  isOpen: boolean;
  electionDetails: ElectionDetails;
  cleanupFunc: () => void;
}

export default function EditElectionModal({
  closeModal,
  isOpen,
  electionDetails,
  cleanupFunc,
}: EditElectionModalInput) {
  let form: any = undefined;
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState<Record<string, any>>({
    title: electionDetails.title,
    description: electionDetails.description,
  });
  const msg_required = 'This field is required';
  const model = Schema.Model({
    title: Schema.Types.StringType().isRequired(msg_required),
    description: Schema.Types.StringType().isRequired(msg_required),
  });

  async function submitNewDetails() {
    if (!form.check()) {
      return;
    }

    const newElectionDetails: ElectionDetails = {
      ...electionDetails,
      title: formData.title,
      description: formData.description,
    };
    updateOldElection(newElectionDetails).then((res: Number) => {
      if (res == 200) {
        Notification['success']({
          title: 'Success',
          description: 'The election details has been successfully updated',
        });
        closeModal();
        cleanupFunc();
      } else {
        Notification['error']({
          title: 'Failed',
          description: 'Failed to update the election details',
        });
        closeModal();
      }
    });
  }
  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="sm"
    >
      <Modal.Header>
        <h5>Edit Election Details</h5>
      </Modal.Header>
      <Modal.Body>
        <Form
          onChange={(newData) => setFormData(newData)}
          onCheck={(newErrors) => setFormErrors(newErrors)}
          formValue={formData}
          formError={formErrors}
          model={model}
          ref={(ref: any) => (form = ref)}
          fluid
        >
          <br />
          <p>
            You can edit the title and description of the current election here
          </p>
          <br />
          <FormGroup>
            <ControlLabel>Title</ControlLabel>
            <FormControl name="title" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl
              name="description"
              componentClass="textarea"
              rows={4}
              type="string"
            />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" onClick={() => submitNewDetails()}>
          Submit
        </Button>
        <Button appearance="default" onClick={() => closeModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
