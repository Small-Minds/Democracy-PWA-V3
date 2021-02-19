import moment from 'moment';
import React from 'react';
import { useState } from 'react';
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
} from 'rsuite';
import {
  ElectionDetails,
  updateOldElection,
} from '../utils/api/ElectionManagement';
interface setTimelineModalInput {
  election: ElectionDetails;
  isOpen: boolean;
  closeModal: any;
}

export default function SetTimelineModal({
  election,
  isOpen,
  closeModal,
}: setTimelineModalInput) {
  const history = useHistory();
  //set up required variable for rsuite forms.
  let form: any = undefined;
  //form model setup
  const msg_required = 'This field is required';
  const model = Schema.Model({
    submission_start_time: Schema.Types.DateType().isRequired(msg_required),
    submission_end_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.submission_start_time) {
          return false;
        }
        return true;
      }, 'The application deadline must be after the start date!'),
    voting_start_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.submission_end_time) {
          return false;
        }
        return true;
      }, 'The voting start date must be after the application deadline date!'),
    voting_end_time: Schema.Types.DateType()
      .isRequired(msg_required)
      .addRule((value, data) => {
        if (value < data.voting_start_time) {
          return false;
        }
        return true;
      }, 'The voting deadline must be after the voting start date!'),
  });
  //formData setup
  const [formData, setFormData] = useState<Record<string, any>>({
    submission_start_time: moment(election.submission_start_time).toDate(),
    submission_end_time: moment(election.submission_end_time).toDate(),
    voting_start_time: moment(election.voting_start_time).toDate(),
    voting_end_time: moment(election.voting_end_time).toDate(),
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const timeformat = 'YYYY-MM-DD HH:mm';

  function updateElection(
    election: ElectionDetails,
    formData: Record<string, any>
  ) {
    if (!form.check()) {
      console.log('New election form has errors.');
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
      if (res != 200) {
        closeModal();
        Notification['error']({
          title: 'Failed',
          description: 'Failed to update the election timelines',
        });
      } else {
        setIsUpdated(true);
      }
    });
  }

  function cleanUpFunc() {
    closeModal();
    history.go(0);
  }
  if (isUpdated) {
    return (
      <Modal backdrop="static" show={isOpen} onHide={() => cleanUpFunc()}>
        <Modal.Header>
          <h4>Success</h4>
        </Modal.Header>
        <Modal.Body>
          The election timelines has been updated successfully!
        </Modal.Body>
        <Modal.Footer>
          <FlexboxGrid justify="end">
            <FlexboxGrid.Item>
              <ButtonToolbar>
                <Button appearance="primary" onClick={() => cleanUpFunc()}>
                  OK
                </Button>
              </ButtonToolbar>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="lg"
    >
      <Modal.Header>
        <h4>Election Timeline Setup</h4>
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
            <ControlLabel>
              <h5>Application starting time and deadline</h5>
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
              <FlexboxGrid.Item style={{ padding: 10 }}>to</FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <FormControl
                  accepter={DatePicker}
                  name="submission_end_time"
                  format={timeformat}
                  placement="bottomStart"
                ></FormControl>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <h5>Voting starting time and deadline</h5>
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
              <FlexboxGrid.Item style={{ padding: 10 }}>to</FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <FormControl
                  accepter={DatePicker}
                  name="voting_end_time"
                  format={timeformat}
                  placement="bottomStart"
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
                  Submit
                </Button>
                <Button onClick={() => closeModal()}>Cancel</Button>
              </ButtonToolbar>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
