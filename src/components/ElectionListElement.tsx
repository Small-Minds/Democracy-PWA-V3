import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();

  const buttonName = useMemo(() => {
    if (!user || !user.user || !user.user.id)
      return t('electionList.button.viewElection');
    if (user.user.id === election.manager)
      return t('electionList.button.manageElection');
    return t('electionList.button.viewElection');
  }, [user, election]);

  return (
    <List.Item key={index} index={index}>
      <FlexboxGrid align="middle" justify="space-between">
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
            {buttonName}&nbsp;
            <Icon icon="arrow-right-line" />
          </Link>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </List.Item>
  );
};

export default ElectionListElement;
