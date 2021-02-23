import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Container, Content, FlexboxGrid, Panel } from 'rsuite';

import ElectionList from '../components/ElectionList';
import NewElectionButton from '../components/NewElectionButton';
import PublicElectionList from '../components/PublicElectionList';

function HomeSetup() {
  const [t, i18n] = useTranslation();

  return (
    <Fragment>
      <h1>{t('setupHomePage.title')}</h1>
      <p>{t('setupHomePage.subtitle')}</p>
      <br />
      <NewElectionButton />
      <br />
      <br />
      <Panel header={<h2>{t('setupHomePage.electionPanelTitle')}</h2>} bordered>
        <ElectionList />
      </Panel>
    </Fragment>
  );
}

export default HomeSetup;
