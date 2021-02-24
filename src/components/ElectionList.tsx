import React, { useEffect, useContext, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FlexboxGrid, List } from 'rsuite';
import Loading from '../pages/Loading';
import { getElectionList, Election } from '../utils/api/ElectionManagement';
import { Credentials } from '../utils/Authentication';
import ElectionListElement from './ElectionListElement';
import NewElectionButton from './NewElectionButton';

export default function ElectionList() {
  const ctx = useContext(Credentials);
  const [electionList, setElectionList] = useState<Array<Election>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [t] = useTranslation();

  useEffect(() => {
    // Return early if no context is provided.
    if (!ctx || !ctx.credentials.authenticated) return;
    // Return if the list has already been populated.
    if (electionList.length > 0) return;
    // If logged in, attempt to get the list of elections.
    getElectionList()
      .then((res) => {
        setElectionList(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ctx]);

  if (loading) return <Loading half />;
  if (!electionList || electionList.length === 0)
    return (
      <Fragment>
        <br />
        <p>{t('electionList.noMatchingElections')}</p>
        <br />
      </Fragment>
    );

  return (
    <div>
      <List>
        {electionList.map((election, index) => (
          <ElectionListElement
            key={index}
            index={index}
            election={election}
            managerList
          />
        ))}
      </List>
    </div>
  );
}
