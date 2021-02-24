import { max } from 'moment';
import React, { useState, useEffect, FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { FlexboxGrid } from 'rsuite';
import ProgressLine from 'rsuite/lib/Progress/ProgressLine';
import Loading from '../pages/Loading';
import {
  CandidateResult,
  ElectionDetails,
  ElectionResult,
  getElectionResult,
  PositionResult,
} from '../utils/api/ElectionManagement';

const Position: FC<{ position: PositionResult }> = ({ position }) => {
  const [t] = useTranslation();
  let maxVotes = 0;

  /**
   * Returns a list of sorted candidates to display for the position.
   */
  const sortedResults: CandidateResult[] = useMemo(
    () =>
      position.candidates
        .map((value) => {
          value.voteCount = value.votes.length;
          if (value.voteCount > maxVotes) maxVotes = value.voteCount;
          return value;
        })
        .sort((a, b) => {
          return (b.voteCount || 0) - (a.voteCount || 0);
        }),
    [position]
  );

  /**
   * Calculates if the top two candidates have equal votes.
   */
  const draw: boolean = useMemo(() => {
    if (!sortedResults || sortedResults.length < 2) return false;
    return sortedResults[0].votes.length === sortedResults[1].votes.length;
  }, [sortedResults]);

  /**
   * If no position or candidates, show alternative views.
   */
  if (!position) return null;
  if (sortedResults.length === 0)
    return (
      <Fragment>
        <br />
        <h3>
          {position.title}: {t('electionResults.noWinner')}
        </h3>
        <br />
      </Fragment>
    );

  return (
    <Fragment>
      <br />
      {draw ? (
        <h3>
          {position.title}: {t('electionResults.draw')}
        </h3>
      ) : (
        <h3>
          {position.title}: {sortedResults[0].user.name}
        </h3>
      )}
      <br />
      {sortedResults.map((res, index) => {
        const percent: number = ((res.voteCount || 0) / maxVotes) * 100;
        const winner: boolean = (res.voteCount || 0) === maxVotes;
        return (
          <div key={index}>
            <p>
              <b>{res.user.name}</b> - {t('electionResults.votes')}:{' '}
              {res.voteCount || 0}
            </p>
            <ProgressLine
              percent={percent}
              showInfo={false}
              status={winner ? 'success' : undefined}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default function ElectionResults() {
  let { id } = useParams<any>();
  const [isLoading, setLoading] = useState(true);
  const [electionResult, setElection] = useState<ElectionResult>();
  const [t] = useTranslation();
  useEffect(() => {
    getElectionResult(id).then((res) => {
      setElection(res);
      setLoading(false);
    });
  }, [id]);

  //waiting for the response from getEletctionList
  if (isLoading) {
    return <Loading half />;
  }

  if (!electionResult) {
    return <p>{t('electionResult.noResult')}</p>;
  }

  return (
    <div>
      {electionResult.positions.map(
        (position: PositionResult, index: number) => (
          <Position position={position} key={index} />
        )
      )}
      <br />
      {/**
      <code>
        <pre>{JSON.stringify(electionResult, null, 2)}</pre>
      </code>
       */}
    </div>
  );
}
