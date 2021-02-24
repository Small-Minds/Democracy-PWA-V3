import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Button, Col, FlexboxGrid, Icon, List } from 'rsuite';
import { Election } from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';

interface ElectionListElementProps {
  index: any;
  election: Election;
  managerList?: boolean;
}

const ElectionListElement: FC<ElectionListElementProps> = ({
  index,
  election,
  managerList = false,
}) => {
  const user = useContext(User);
  const [t] = useTranslation();
  const history = useHistory();

  const manager: boolean = useMemo(() => {
    if (managerList) return true;
    if (!user || !user.user || !user.user.id || !election) return false;
    return user.user.id === election.manager;
  }, [user, election]);

  const buttonName: string = useMemo(() => {
    if (!user || !user.user || !user.user.id)
      return t('electionList.button.viewElection');
    if (managerList || user.user.id === election.manager)
      return t('electionList.button.manageElection');
    return t('electionList.button.viewElection');
  }, [user, election]);

  /** Fall back on the election description if no subtitle is available. */
  const subtitle: string = useMemo(() => {
    if (election.subtitle) return election.subtitle;
    if (election.description) {
      if (election.description.length < 200) return election.description;
      return election.description.substring(0, 180) + '...';
    }
    return '';
  }, [election]);

  return (
    <List.Item key={index} index={index}>
      <FlexboxGrid align="middle" justify="space-between">
        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={16}>
          <h3>{election.title}</h3>
          <p>
            <b>@{election.election_email_domain}</b>
            &nbsp;&middot;&nbsp;
            <span>{subtitle}</span>
          </p>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          componentClass={Col}
          colspan={24}
          sm={8}
          style={{ paddingRight: 20, textAlign: 'right' }}
        >
          <Button
            size="lg"
            color={manager ? 'green' : undefined}
            onClick={() => history.push(`/election/${election.id}`)}
          >
            {buttonName}
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </List.Item>
  );
};

export default ElectionListElement;
