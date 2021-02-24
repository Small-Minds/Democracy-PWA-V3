import React, { Fragment, useMemo, useState } from 'react';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, FlexboxGrid, Modal } from 'rsuite';
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
        show={open}
        onHide={() => {
          setOpen(false);
        }}
      >
        <Modal.Header>{t('candidateInfoComp.modalTitle')}</Modal.Header>
        <Modal.Body style={{ padding: 10 }}>
          <FlexboxGrid justify="start" align="middle">
            <FlexboxGrid.Item>
              <Avatar
                size="lg"
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {userImage}
              </Avatar>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item style={{ padding: 10 }}>
              <h5>{candidate.user.name}</h5>
              <p>
                <code>{candidate.user.email}</code>
              </p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <br />
          <h5>{t('candidateInfoComp.candidatePlatform')}</h5>
          <p>{candidate.platform}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            {t('general.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
