import React, { FC, Fragment } from 'react';
import { Icon, Loader, Timeline } from 'rsuite';
import { ElectionDetails } from '../utils/api/ElectionManagement';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  election: ElectionDetails;
}

const timeformat: string = 'MMMM DD, YYYY, hh:mm A';

const ElectionTimeline: FC<Props> = ({ election }) => {
  if (!election)
    return (
      <Fragment>
        <div style={{ marginBottom: 20 }}>
          <Loader size="md" />
        </div>
      </Fragment>
    );
  const [t] = useTranslation();
  return (
    <Fragment>
      <div style={{ marginBottom: 20 }}>
        <Timeline className="custom-timeline">
          <Timeline.Item dot={<Icon icon="eye" size="2x" />}>
            <p>
              <b>{moment(election.submission_start_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.appBtn')}</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="pencil" size="2x" />}>
            <p>
              <b>{moment(election.submission_end_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.appEnd')}</p>
          </Timeline.Item>
          <Timeline.Item>
            <p>{t('electionTimeline.review')}</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="list" size="2x" />}>
            <p>
              <b>{moment(election.voting_start_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.voteBegin')}</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="check-square-o" size="2x" />}>
            <p>
              <b>{moment(election.voting_end_time).format(timeformat)}</b>
            </p>
            <p>{t('electionTimeline.voteEnd')}</p>
          </Timeline.Item>
        </Timeline>
      </div>
    </Fragment>
  );
};

export default ElectionTimeline;
