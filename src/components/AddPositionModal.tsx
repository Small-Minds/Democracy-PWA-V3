import React, { FC, Fragment, useContext, useState } from 'react';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Notification,
  Schema,
} from 'rsuite';
import { Credentials } from '../utils/Authentication';
import { createPosition, ElectionDetails, Position } from '../utils/api/ElectionManagement';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { idText } from 'typescript';

interface APMProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  election: ElectionDetails;
  onCreate: (p: Position) => void;
}

/**
 * Modal for adding election positions.
 * Uses open and setOpen props from parent.
 */
const AddPositionModal: FC<APMProps> = ({ open, setOpen, election, onCreate }) => {
  const ctx = useContext(Credentials);
  const [loading, setLoading] = useState<boolean>(false);
  const [t] = useTranslation();
  //set up required variable for rsuite forms.
  let form: any = undefined;
  //form model setup
  const msg_required = 'This field is required';
  const model = Schema.Model({
    title: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required),
    description: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required),
  });
  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  const createNewPosition = async (title: string, description: string) => {
    if (!ctx || !ctx.credentials.authenticated) return;
    setLoading(true);

    // Process form input, check for form errors
    if (!form.check()) {
      console.log('New election form has errors.');
      console.log(formErrors);
      setLoading(false);
      return;
    }
    // Call the creation endpoint.
    createPosition({
      title: title,
      description: description,
      election: election.id,
    })
      .then((position) => {
        onCreate(position);
      })
      .catch((x) => {
        console.error(x);
        Notification['error']({
          title: t('createElectionBtn.failMsgTitle'),
          description: t('createElectionBtn.failMsg'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <Modal size="sm" show={open} onHide={() => setOpen(false)}>
        <Modal.Title>Add A New Position</Modal.Title>
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
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl name="title" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                rows={3}
                name="description"
                componentClass="textarea"
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!ctx?.credentials.authenticated}
            loading={loading}
            appearance="subtle"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!ctx?.credentials.authenticated}
            loading={loading}
            appearance="primary"
            onClick={() => {
              setLoading(true);
              createNewPosition(formData.title, formData.description);
            }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default AddPositionModal;
