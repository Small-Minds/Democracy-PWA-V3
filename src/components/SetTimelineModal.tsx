import React from 'react';
import { useState } from 'react';
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
} from 'rsuite';
import { ElectionDetails } from '../utils/api/ElectionManagement';
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
  //set up required variable for rsuite forms.
  let form: any = undefined;
  //form model setup
  const msg_required = "This field is required";
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
  const [formData, setFormData] = useState<Record<string,any>>({
    submission_start_time: election.submission_start_time,
    submission_end_time: election.submission_end_time,
    voting_start_time: election.voting_start_time,
    voting_end_time: election.voting_end_time,
  });
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
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
                <Button appearance="primary">Submit</Button>
                <Button onClick={() => closeModal()}>Cancel</Button>
              </ButtonToolbar>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
