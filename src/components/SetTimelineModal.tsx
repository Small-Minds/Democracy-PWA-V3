import React from 'react';
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
  return (
    <Modal backdrop="static" show={isOpen} onHide={() => closeModal()}>
      <Modal.Header>election Timeline Setup</Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup>
            <ControlLabel>Application starting date and deadline</ControlLabel>
            <InputGroup style={{ width: 460 }}>
              <FormControl
                accepter={DatePicker}
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                placement="topStart"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="topStart"
                />
              </FormControl>
              <InputGroup.Addon>To</InputGroup.Addon>
              <FormControl
                accepter={DatePicker}
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                placement="topStart"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="topStart"
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
                placement="topStart"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="topStart"
                />
              </FormControl>
              <InputGroup.Addon>To</InputGroup.Addon>
              <FormControl
                accepter={DatePicker}
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                placement="topStart"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  block
                  appearance="subtle"
                  placement="topStart"
                />
              </FormControl>
            </InputGroup>
          </FormGroup>
          <Divider />
          <FlexboxGrid justify="end">
            <FlexboxGrid.Item>
              <ButtonToolbar>
                <Button>Submit</Button>
                <Button onClick={() => closeModal()}>Cancel</Button>
              </ButtonToolbar>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
