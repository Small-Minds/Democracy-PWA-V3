import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'rsuite';
import {
  getPublicElectionList,
  Election,
} from '../utils/api/ElectionManagement';
import { Credentials } from '../utils/Authentication';
import ElectionListElement from './ElectionListElement';

export default function PublicElectionList() {
  const ctx = useContext(Credentials);
  const [electionList, setElectionList] = useState<Array<Election>>([]);

  useEffect(() => {
    // Return if the list has already been populated.
    if (electionList.length > 0) return;
    // If logged in, attempt to get the list of elections.
    getPublicElectionList().then((res) => {
      setElectionList(res.data);
      console.log(res.data);
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
