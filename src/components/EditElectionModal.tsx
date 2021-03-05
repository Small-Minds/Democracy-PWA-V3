import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();
  async function submitNewDetails() {
    if (!form.check()) {
      return;
    }
    //Pass the formData the the endpoint
    updateOldElection(formData, electionDetails.id).then((res: Number) => {
      if (res == 200) {
        Notification['success']({
          title: t('v2.editElectionModal.successNotificationTitle'),
          description: t('v2.editElectionModal.successNotificationBody'),
        });
        closeModal();
        cleanupFunc();
      } else {
        Notification['error']({
          title: t('v2.editElectionModal.errorNotificationTitle'),
          description: t('v2.editElectionModal.errorNotificationBody'),
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
        <h5>{t('v2.editElectionModal.title')}</h5>
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
          <p>{t('v2.editElectionModal.instructions')}</p>
          <br />
          <FormGroup>
            <ControlLabel>{t('v2.editElectionModal.titleLabel')}</ControlLabel>
            <FormControl name="title" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              {t('v2.editElectionModal.descriptionLabel')}
            </ControlLabel>
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
          {t('v2.editElectionModal.subBtn')}
        </Button>
        <Button appearance="default" onClick={() => closeModal()}>
          {t('v2.editElectionModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
