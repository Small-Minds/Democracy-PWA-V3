import React, { Fragment } from 'react';
import { useContext } from 'react';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Avatar, Button } from 'rsuite';
import { User } from '../utils/api/User';

export default function ManageAccount() {
  const user = useContext(User);
  const history = useHistory();
  const [t] = useTranslation();
  return (
    <Fragment>
      <h1>{t('manageAccountPage.title')}</h1>
      <p>{t('manageAccountPage.instruction')}</p>
      <br />
      <p>
        In development! Tools will be added here soon to manage your account.
      </p>
      <Avatar style={{ marginTop: 20, marginBottom: 20 }}>
        <Gravatar email={user?.user.email} size={40} rating="pg" />
      </Avatar>
      <br />
      <Button
        onClick={() => {
          window.location.href = `https://en.gravatar.com/`;
        }}
        primary
      >
        {t('manageAccountPage.changeProfileBtn')}
      </Button>
    </Fragment>
  );
}
