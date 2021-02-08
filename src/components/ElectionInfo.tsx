import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Election, getElection } from '../utils/api/ElectionManagement';

export default function ElectionInfo() {
  let { id } = useParams<any>();
  const [isLoading, setLoading] = useState(true);
  const [election, setElection] = useState<Election>();

  useEffect(() => {
    getElection(id).then((res) => {
      console.log(res);
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
      <h3>Election Id: {election?.id}</h3>
      <h3>Election Creatation Date: {election?.created}</h3>
    </div>
  );
}
