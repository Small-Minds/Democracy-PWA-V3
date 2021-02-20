import React, { FC, Fragment, useMemo } from 'react';
import Gravatar from 'react-gravatar';
import { Avatar, FlexboxGrid, Icon } from 'rsuite';
import { ElectionDetails } from '../utils/api/ElectionManagement';

interface EMProps {
  election: ElectionDetails;
}

const ElectionManager: FC<EMProps> = ({ election }) => {
  const userImage = useMemo(() => {
    return <Gravatar email={election.manager.email} size={40} rating="pg" />;
  }, [election]);

  const initials = useMemo(() => {
    return '';
  }, [election]);

  if (!election || !election.manager || !election.manager.email) return null;
  return (
    <Fragment>
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item>
          <Avatar style={{ margin: 7, marginLeft: 2, marginRight: 2 }}>
            {/** Render initials or avatar as fallback */}
            <b>{userImage || initials || <Icon icon="avatar" />}</b>
          </Avatar>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item style={{ padding: 10 }}>
          <h5>Run by {election.manager.name}</h5>
          <p>
            <code>{election.manager.email}</code>
          </p>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item></FlexboxGrid.Item>
      </FlexboxGrid>
    </Fragment>
  );
};

export default ElectionManager;
