import moment from 'moment';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  DatePicker,
  Divider,
  FlexboxGrid,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Modal,
  Schema,
  Notification,
  Message,
} from 'rsuite';
import {
  ElectionDetails,
  updateOldElection,
} from '../utils/api/ElectionManagement';
interface setTimelineModalInput {
  election: ElectionDetails;
  isOpen: boolean;
  closeModal: () => void;
  cleanupFunc: () => void;
}

export default function SetTimelineModal({
  election,
  isOpen,
  closeModal,
  cleanupFunc,
}: setTimelineModalInput) {
  const [t] = useTranslation();

  //set up required variable for rsuite forms.
  let form: any = undefined;
  //form model setup
  const msg_required = t('general.required');
  const model = Schema.Model({
    submission_start_time: Schema.Types.DateType().isRequired(msg_required),
    submission_end_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.submission_start_time) {
          return false;
        }
        return true;
      }, t('setTimelineModal.error.applicationDeadlineEarly')),
    voting_start_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.submission_end_time) {
          return false;
        }
        return true;
      }, t('setTimelineModal.error.voteStartEarly')),
    voting_end_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.voting_start_time) {
          return false;
        }
        return true;
      }, t('setTimelineModal.error.voteDeadlineEarly')),
  });
  //formData setup
  const [formData, setFormData] = useState<Record<string, any>>({
    submission_start_time: moment(election.submission_start_time).toDate(),
    submission_end_time: moment(election.submission_end_time).toDate(),
    voting_start_time: moment(election.voting_start_time).toDate(),
    voting_end_time: moment(election.voting_end_time).toDate(),
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const timeformat = 'YYYY-MM-DD HH:mm';

  function updateElection(
    election: ElectionDetails,
    formData: Record<string, any>
  ) {
    if (!form.check()) {
      console.log(formErrors);
      return;
    }
    const newElectionDetails: ElectionDetails = {
      ...election,
      submission_end_time: formData.submission_end_time,
      submission_start_time: formData.submission_start_time,
      voting_start_time: formData.voting_start_time,
      voting_end_time: formData.voting_end_time,
    };

    updateOldElection(newElectionDetails).then((res) => {
      if (res == 200) {
        cleanupFunc();
        Notification['success']({
          title: t('setTimelineModal.updateNotification.successTitle'),
          description: t('setTimelineModal.updateNotification.successBody'),
        });
      } else {
        Notification['error']({
          title: t('setTimelineModal.updateNotification.errorTitle'),
          description: t('setTimelineModal.updateNotification.errorBody'),
        });
      }
      closeModal();
    });
  }

  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="sm"
      overflow={false}
    >
      <Modal.Header>
        <h4>{t('setTimelineModal.title')}</h4>
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
          <FormGroup>
            <Message
              type="warning"
              showIcon
              description={t('setTimelineModal.message.changeTimelineWarning')}
            />
            <br />
            <ControlLabel>
              <h5>{t('setTimelineModal.headings.applicationTimes')}</h5>
            </ControlLabel>
            <FlexboxGrid justify="start" align="middle">
              <FlexboxGrid.Item>
                <FormControl
                  accepter={DatePicker}
                  name="submission_start_time"
                  format={timeformat}
                  placement="bottomStart"
                ></FormControl>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ padding: 10 }}>
                {t('setTimelineModal.form.timeDivider')}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <FormControl
                  accepter={DatePicker}
                  name="submission_end_time"
                  format={timeformat}
                  placement="bottomEnd"
                ></FormControl>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <h5>{t('setTimelineModal.headings.votingTimes')}</h5>
            </ControlLabel>
            <FlexboxGrid justify="start" align="middle">
              <FlexboxGrid.Item>
                <FormControl
                  accepter={DatePicker}
                  name="voting_start_time"
                  format={timeformat}
                  placement="bottomStart"
                ></FormControl>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ padding: 10 }}>
                {t('setTimelineModal.form.timeDivider')}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <FormControl
                  accepter={DatePicker}
                  name="voting_end_time"
                  format={timeformat}
                  placement="bottomEnd"
                ></FormControl>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FormGroup>
          <Divider />
          <FlexboxGrid justify="end">
            <FlexboxGrid.Item>
              <ButtonToolbar>
                <Button
                  appearance="primary"
                  type="submit"
                  onClick={() => {
                    updateElection(election, formData);
                  }}
                >
                  {t('general.submit')}
                </Button>
                <Button onClick={() => closeModal()}>
                  {t('general.cancel')}
                </Button>
              </ButtonToolbar>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
