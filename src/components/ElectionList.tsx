import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'rsuite';
import { getElectionList, Election } from '../utils/api/ElectionManagement';
import { Credentials } from '../utils/Authentication';
import ElectionListElement from './ElectionListElement';

export default function ElectionList() {
  const ctx = useContext(Credentials);
  const [electionList, setElectionList] = useState<Array<Election>>([]);

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
