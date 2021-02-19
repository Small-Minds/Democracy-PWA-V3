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
  Notification
} from 'rsuite';
import { updateModuleDeclaration } from 'typescript';
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
    submission_start_time: election.submission_start_time,
    submission_end_time: election.submission_end_time,
    voting_start_time: election.voting_start_time,
    voting_end_time: election.voting_end_time,
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  function updateElection(
    election: ElectionDetails,
    formData: Record<string, any>
  ) {
    const newElectionDetails: ElectionDetails = {
      ...election,
      submission_end_time: formData.submission_end_time,
      submission_start_time: formData.submission_start_time,
      voting_start_time: formData.voting_start_time,
      voting_end_time: formData.voting_end_time,
    };
    updateOldElection(newElectionDetails)
      .then(() => setIsUpdated(true))
  }

  function cleanUpFunc (){
      closeModal();
      history.go(0);
  }
  if(isUpdated){
    return (
        <Modal backdrop="static" show={isOpen} onHide={() => cleanUpFunc()}>
            <Modal.Header>Success</Modal.Header>
            <Modal.Body>The election timelines has been updated successfully!</Modal.Body>
            <Modal.Footer>
            <FlexboxGrid justify="end">
            <FlexboxGrid.Item>
              <ButtonToolbar>
                <Button
                  appearance="primary"
                  onClick={() => cleanUpFunc()}
                >
                  OK
                </Button>
              </ButtonToolbar>
            </FlexboxGrid.Item>
          </FlexboxGrid>
            </Modal.Footer>
        </Modal>
    )
  }

  return (
    <Modal backdrop="static" show={isOpen} onHide={() => closeModal()}>
      <Modal.Header>election Timeline Setup</Modal.Header>
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
            <ControlLabel>Application starting date and deadline</ControlLabel>
            <InputGroup style={{ width: 460 }}>
              <FormControl
                accepter={DatePicker}
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                placement="bottomStart"
                name="submission_start_time"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="bottomStart"
                />
              </FormControl>
              <InputGroup.Addon>To</InputGroup.Addon>
              <FormControl
                accepter={DatePicker}
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                placement="bottomStart"
                name="submission_end_time"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="bottomStart"
                />
              </FormControl>
            </InputGroup>
          </FormGroup>
          <Divider />
          <FormGroup>
            <ControlLabel>Voting starting date and deadline</ControlLabel>
            <InputGroup style={{ width: 460 }}>
              <FormControl
                accepter={DatePicker}
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                placement="bottomStart"
                name="voting_start_time"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="bottomStart"
                />
              </FormControl>
              <InputGroup.Addon>To</InputGroup.Addon>
              <FormControl
                accepter={DatePicker}
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                placement="bottomStart"
                name="voting_end_time"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="bottomStart"
                />
              </FormControl>
            </InputGroup>
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
