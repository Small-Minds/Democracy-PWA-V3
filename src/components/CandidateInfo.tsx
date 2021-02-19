import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import Gravatar from 'react-gravatar';
import { Modal, Button, Avatar } from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import { CandidateWithUserDetails } from '../utils/api/ElectionManagement';

interface CandidateInfoModalInput {
  candidate: CandidateWithUserDetails;
}
export default function CandidateInfo({ candidate }: CandidateInfoModalInput) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <Button
        appearance="ghost"
        onClick={() => {
          setOpen(true);
        }}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        <Avatar
          size="lg"
          style={{
            display: 'block',
            margin: 'auto',
            marginTop: 10,
          }}
        >
          <Gravatar email={candidate.user.email} size={60} rating="pg" />
        </Avatar>
        <h5 style={{ marginTop: 5, textAlign: 'center' }}>
          {candidate.user.name}
        </h5>
      </Button>
      <Modal
        backdrop={'static'}
        show={open}
        onHide={() => {
          setOpen(false);
        }}
      >
        <Modal.Header>Candidate Information</Modal.Header>
        <Modal.Body>
          <Avatar
            size="lg"
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
            }}
          >
            <Gravatar email={candidate.user.email} size={60} rating="pg" />
          </Avatar>
          <h5>Name: {candidate.user.name}</h5>
          <br />
          <h5>Personal Statement:</h5>
          <p>{candidate.platform}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            appearance="primary"
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
