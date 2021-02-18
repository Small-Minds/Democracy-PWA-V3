import React, { FC, Fragment } from 'react';
import { Icon, Loader, Timeline } from 'rsuite';
import { ElectionDetails } from '../utils/api/ElectionManagement';
import moment from 'moment';

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
  return (
    <Fragment>
      <div style={{ marginBottom: 20 }}>
        <Timeline className="custom-timeline">
          <Timeline.Item dot={<Icon icon="eye" size="2x" />}>
            <p>
              <b>{moment(election.submission_start_time).format(timeformat)}</b>
            </p>
            <p>Application period begins</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="pencil" size="2x" />}>
            <p>
              <b>{moment(election.submission_end_time).format(timeformat)}</b>
            </p>
            <p>Application period ends</p>
          </Timeline.Item>
          <Timeline.Item>
            <p>Review of applications by election manager</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="list" size="2x" />}>
            <p>
              <b>{moment(election.voting_start_time).format(timeformat)}</b>
            </p>
            <p>Voting period begins</p>
          </Timeline.Item>
          <Timeline.Item dot={<Icon icon="check-square-o" size="2x" />}>
            <p>
              <b>{moment(election.voting_end_time).format(timeformat)}</b>
            </p>
            <p>Voting period ends</p>
          </Timeline.Item>
        </Timeline>
      </div>
    </Fragment>
  );
};

export default ElectionTimeline;
