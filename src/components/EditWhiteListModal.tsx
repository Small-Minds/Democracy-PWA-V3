import React, { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Loader,
  Modal,
  Notification,
  Schema,
} from 'rsuite';
import {
  getManagedElectionDetails,
  ManagedElectionDetails,
  updateManagedElection,
} from '../utils/api/ElectionManagement';

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
  let form: any = undefined;
  const [isLoading, setIsLoading] = useState<boolean>();
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [
    electionDetail,
    setElectionDetail,
  ] = useState<ManagedElectionDetails>();
  const [formData, setFormData] = useState<Record<string, any>>({
    whitelist: '',
  });
  const model = Schema.Model({
    whitelist: Schema.Types.StringType(),
  });
  const [t] = useTranslation();

  useEffect(() => {
    getManagedElectionDetails(electionId).then((res) => {
      setElectionDetail(res);
      setFormData({ whitelist: res.whitelist });
      setIsLoading(false);
    });
  }, [electionId]);

  function submitWhitelist(input: string): void {
    if (electionDetail) {
      const newManagedElectionDetails: ManagedElectionDetails = {
        ...electionDetail,
        whitelist: input,
      };
      updateManagedElection(newManagedElectionDetails, electionId).then(
        (res: number) => {
          console.log(res);
          if (res == 200) {
            Notification['success']({
              title: t('v2.editWhitelistModal.successNotificationTitle'),
              description: t('v2.editWhitelistModal.successNotificationBody'),
            });
            closeModal();
          } else {
            Notification['error']({
              title: t('v2.editWhitelistModal.errorNotificationTitle'),
              description: t('v2.editWhitelistModal.errorNotificationBody'),
            });
          }
        }
      );
    }
  }

  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="lg"
    >
      <Modal.Header>
        <h5>{t('v2.editWhitelistModal.title')}</h5>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Loader />
        ) : (
          <Form
            onChange={(newData) => setFormData(newData)}
            onCheck={(newErrors) => setFormErrors(newErrors)}
            formValue={formData}
            formError={formErrors}
            model={model}
            ref={(ref: any) => (form = ref)}
            fluid
          >
            <FormGroup>
              <ControlLabel>
                {t('v2.editWhitelistModal.formLabel')}
              </ControlLabel>
              <FormControl
                name="whitelist"
                componentClass="textarea"
                rows={100}
                placeholder="whitelist"
                type="string"
              />
            </FormGroup>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          appearance="primary"
          disabled={isLoading}
          onClick={() => submitWhitelist(formData.whitelist)}
        >
          {t('v2.editWhitelistModal.submitBtn')}
        </Button>
        <Button appearance="default" onClick={() => closeModal()}>
          {t('v2.editWhitelistModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
