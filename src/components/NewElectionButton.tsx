import React, { Fragment, useContext, useState } from 'react';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Notification,
  Radio,
  RadioGroup,
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
  const msg_required = t('createElectionBtn.msgRequired');
  const msg_ivalid_format = t('createElectionBtn.msgInvalidFormat');
  const model = Schema.Model({
    title: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required),
    description: Schema.Types.StringType()
      .isRequired(msg_required)
      .minLength(1, msg_required),
    enable_multiple_submissions: Schema.Types.BooleanType(),
    election_email_domain: Schema.Types.StringType()
      .isRequired(msg_required)
      .pattern(
        /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/,
        msg_ivalid_format
      ),
  });
  //form data setup
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    description: '',
    enable_multiple_submissions: false,
    election_email_domain: 'uottawa.ca',
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const history = useHistory();

  /**
   * Creates a new election and navigates to that page.
   * @param electionDetails User input for the election details
   */
  const createElection = async (electionDetails: Record<string, any>) => {
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
      title: electionDetails.title,
      description: electionDetails.description,
      election_email_domain: electionDetails.election_email_domain,
      enable_multiple_submissions: electionDetails.enable_multiple_submissions,
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
        <Modal.Title>{t('createElectionBtn.electionFormTitle')}</Modal.Title>
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
              <ControlLabel>
                {t('createElectionBtn.electionTitle')}
              </ControlLabel>
              <FormControl name="title" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {t('createElectionBtn.electionDescription')}
              </ControlLabel>
              <FormControl
                rows={3}
                name="description"
                componentClass="textarea"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {t('createElectionBtn.electionEnableMultiSubs')}
              </ControlLabel>
              <FormControl
                name="enable_multiple_submissions"
                accepter={RadioGroup}
                inline
              >
                <Radio value={true}>
                  {t('createElectionBtn.electionMultiSubsTrue')}
                </Radio>
                <Radio value={false} checked>
                  {t('createElectionBtn.electionMultiSubsFalse')}
                </Radio>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                {t('createElectionBtn.electionEmailDomain')}
              </ControlLabel>
              <FormControl name="election_email_domain"></FormControl>
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
              createElection(formData);
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
