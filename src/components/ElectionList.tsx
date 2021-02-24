import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from 'rsuite';
import Loading from '../pages/Loading';
import { Election, getElectionList } from '../utils/api/ElectionManagement';
import { Credentials } from '../utils/Authentication';
import ElectionListElement from './ElectionListElement';

export default function ElectionList() {
  const ctx = useContext(Credentials);
  const [electionList, setElectionList] = useState<Array<Election>>([]);
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
      });
  }, [ctx]);

  if (!electionList) return <Loading />;
  if (electionList.length === 0)
    return (
      <Fragment>
        <p>{t('electionList.noMatchingElections')}</p>
      </Fragment>
    );
  return (
    <div>
      <List>
        {electionList.map((election, index) => (
          <ElectionListElement key={index} index={index} election={election} />
        ))}
      </List>
    </div>
  );
}
