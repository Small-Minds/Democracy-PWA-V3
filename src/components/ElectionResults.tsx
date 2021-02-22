import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ElectionDetails,
  getElectionResult,
} from '../utils/api/ElectionManagement';

export default function ElectionResults() {
  let { id } = useParams<any>();
  const [isLoading, setLoading] = useState(true);
  const [electionResult, setElection] = useState<any>({});

  useEffect(() => {
    getElectionResult(id).then((res) => {
      setElection(res);
      setLoading(false);
    });
  }, [id]);

  //waiting for the response from getEletctionList
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <code>
        <pre>{JSON.stringify(electionResult, null, 2)}</pre>
      </code>
    </div>
  );
}
