import React, { Fragment, useContext, useState } from 'react';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Modal,
  Notification,
  Panel,
  Schema,
} from 'rsuite';
import { Credentials } from '../utils/Authentication';
import { create } from '../utils/api/ElectionManagement';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

/**
 * Reminder to self:
 * Max editing this file. Do not edit until his PR is merged.
 */

function NewElectionButton() {
  // When the app first starts, it is unauthenticated.
  const ctx = useContext(Credentials);
  const [loading, setLoading] = useState<boolean>(false);
  // Modal open/closed state:
  const [open, setOpen] = useState<boolean>(false);
  // Set up localization hook
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
  const history = useHistory();

  /**
   * Creates a new election and navigates to that page.
   * @param title New title for the election.
   * @param description New description for the election.
   */
  const createElection = async (title: string, description: string) => {
    // If  not authenticated, quit early.
    if (!ctx || !ctx.credentials.authenticated) return;
    // Otherwise, start loading animations.
    setLoading(true);

    // Use a fake date until the form is implemented.
    const d = new Date();

    // Process form input, check for form errors
    if (!form.check()) {
      console.log('New election form has errors.');
      console.log(formErrors);
      setLoading(false);
      return;
    }
    // Call the creation endpoint.
    create({
      title: title,
      description: description,
      election_email_domain: 'uottawa.ca',
      enable_multiple_submissions: false,
      submission_end_time: d,
      submission_start_time: d,
      voting_end_time: d,
      voting_start_time: d,
    })
      .then((election) => {
        let path = `/election/${election.id}`;
        history.push(path);
      })
      .catch((x) => {
        console.log(x.response.data);
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
      <Button
        appearance="primary"
        size="lg"
        disabled={!ctx?.credentials.authenticated}
        loading={loading}
        onClick={() => setOpen(true)}
      >
        {t('createElectionBtn.btnLabel')}
      </Button>
      <Modal size="sm" show={open} onHide={() => setOpen(false)}>
        <Modal.Title>Create a New Election</Modal.Title>
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
              createElection(formData.title, formData.description);
            }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default NewElectionButton;
