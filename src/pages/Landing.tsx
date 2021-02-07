import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

function Landing() {
  const [t] = useTranslation();
  const history = useHistory();

  // If a user lands on this page, set history to '/'.
  useEffect(() => {
    history.replace('/');
  }, []);

  return (
    <Fragment>
      <h1>{t('mainPage.appName')}</h1>
      <br />
      <p>{t('mainPage.slogan')}</p>
      <br />
      <LoginForm />
      <SignupForm />
    </Fragment>
  );
}

export default Landing;
