import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ProgressLine from 'rsuite/lib/Progress/ProgressLine';
import Loading from '../pages/Loading';
import {
  CandidateResult,
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
      <div style={{ marginBottom: 30 }}>
        <h4>
          {position.title}: {t('electionResults.noWinner')}
        </h4>
      </div>
    );

  return (
    <div style={{ marginBottom: 30 }}>
      <br />
      {draw ? (
        <h4>
          {position.title} &rarr; {t('electionResults.draw')}
        </h4>
      ) : (
        <h4>
          {position.title} &rarr; {sortedResults[0].user.name}
        </h4>
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
      <br />
      <p>
        Votes of Abstention: <code>{position.abstain}</code>
        <br />
        Votes of No Confidence: <code>{position.no_confidence}</code>
      </p>
    </div>
  );
};

export default function ElectionResults() {
  let { id } = useParams<any>();
  const [isLoading, setLoading] = useState(true);
  const [electionResult, setElection] = useState<ElectionResult>();
  const [t] = useTranslation();
  useEffect(() => {
    if (!id) return;
    getElectionResult(id).then((res) => {
      console.log(res); // TODO: Remove me!
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
      <Fade cascade duration={400} triggerOnce damping={0.2}>
        {electionResult.positions.map(
          (position: PositionResult, index: number) => (
            <Position position={position} key={index} />
          )
        )}
        <br />
      </Fade>
    </div>
  );
}
