import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Content } from 'rsuite';

interface InfoModalProps {
  open: boolean;
  setOpen: (x: boolean) => any;
}

const InfoModal: FC<InfoModalProps> = ({ open, setOpen }) => {
  const [t] = useTranslation();

  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>Application Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Content>
          <h1>Democracy</h1>
          <br />
          <p>
            Built by <b>Ryan Fleck</b> and <b>Mengxuan Chen</b>, the{' '}
            <b>Small Minds</b> team circa 2020.
          </p>
          <br />
          <br />
          <h4>{t('v2.infoModal.titles.contributors')}</h4>
          <br />
          <ul>
            <li>
              <b>Nicholas Morin</b> &middot; French translation
            </li>
            <li>
              <b>Alae Boufarrachene</b> &middot; Arabic translation
            </li>
            <li>
              <b>Sirjan S. Rekhi</b> &middot; Hindi translation
            </li>
          </ul>
          <br />
          <br />
          <h4>{t('v2.infoModal.titles.tos')}</h4>
          {t('semiLegal.termsOfService')}
          <br />
          <br />
          <h4>{t('v2.infoModal.titles.privacy')}</h4>
          {t('semiLegal.privacyPolicy')}
          <br />
          <br />
        </Content>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpen(false)} appearance="subtle">
          {t('confirmModal.cancelBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
