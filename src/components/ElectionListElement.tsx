import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, List } from 'rsuite';
import { Election } from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';

interface ElectionListElementProps {
  index: any;
  election: Election;
}

const ElectionListElement: FC<ElectionListElementProps> = ({
  index,
  election,
}) => {
  const user = useContext(User);

  const defaultName = 'View Election';
  const manageName = 'Manage Election';
  const getButtonName = () => {
    if (!user || !user.user || !user.user.id) return defaultName;
    if (user.user.id === election.manager) return manageName;
    return defaultName;
  };

  return (
    <List.Item key={index} index={index}>
      <FlexboxGrid align="middle" justify="space-around">
        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={16}>
          <h3>{election.title}</h3>
          <p>
            <b>@{election.election_email_domain}</b>
            &nbsp;&middot;&nbsp;
            <span>{election.description}</span>
          </p>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          componentClass={Col}
          colspan={24}
          sm={8}
          style={{ paddingRight: 20, textAlign: 'right' }}
        >
          <Link to={`/election/${election.id}`}>
            {getButtonName()}&nbsp;
            <Icon icon="arrow-right-line" />
          </Link>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </List.Item>
  );
};

export default ElectionListElement;
