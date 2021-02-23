import React, { Fragment, useState, useMemo } from 'react';
import { useEffect } from 'react';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Avatar } from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import { CandidateWithUserDetails } from '../utils/api/ElectionManagement';

interface CandidateInfoModalInput {
  candidate: CandidateWithUserDetails;
}
export default function CandidateInfo({ candidate }: CandidateInfoModalInput) {
  const [open, setOpen] = useState<boolean>(false);

  const userImage = useMemo(() => {
    if (!candidate || !candidate.user || !candidate.user.email) return null;
    return <Gravatar email={candidate.user.email} size={60} rating="pg" />;
  }, [candidate]);

  const [t] = useTranslation();
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
          {userImage}
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
        <Modal.Header>{t('candidateInfoComp.modalTitle')}</Modal.Header>
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
          <h5>{`${t('candidateInfoComp.candidateName')} ${
            candidate.user.name
          }`}</h5>
          <br />
          <h5>{t('candidateInfoComp.candidatePersonalStatement')}</h5>
          <p>{candidate.platform}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            appearance="primary"
          >
            {t('candidateInfoComp.okBtn')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
