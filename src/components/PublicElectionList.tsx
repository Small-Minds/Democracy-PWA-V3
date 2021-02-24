import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FlexboxGrid, List } from 'rsuite';
import Loading from '../pages/Loading';
import {
  Election,
  getPublicElectionList,
} from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';
import { Credentials } from '../utils/Authentication';
import ElectionListElement from './ElectionListElement';
import NewElectionButton from './NewElectionButton';

interface PELProps {
  filterDomain?: boolean;
}

const PublicElectionList: FC<PELProps> = ({ filterDomain = false }) => {
  const ctx = useContext(Credentials);
  const user = useContext(User);
  const [electionList, setElectionList] = useState<Array<Election>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [t] = useTranslation();

  const userDomain = useMemo(() => {
    if (!user || !user.user || !user.user.email) return '';
    const domain = user.user.email.split('@');
    if (domain.length === 2) return domain[1];
    return '';
  }, [user]);

  useEffect(() => {
    // Return if the list has already been populated.
    if (electionList.length > 0) return;
    // If logged in, attempt to get the list of elections.
    getPublicElectionList()
      .then((res) => {
        const elections: Election[] = res.data;

        return setElectionList(
          filterDomain
            ? elections.filter((e) => e.election_email_domain === userDomain)
            : elections
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ctx]);

  if (!user || !user.user || !user.user.email) return null;
  if (loading) return <Loading half />;
  if (!electionList || electionList.length === 0)
    return (
      <Fragment>
        <br />
        <FlexboxGrid align="middle" justify="center">
          <FlexboxGrid.Item>
            <p>{t('electionList.noMatchingElections')}</p>
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <br />
        <FlexboxGrid align="middle" justify="center">
          <FlexboxGrid.Item>
            <NewElectionButton />
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <br />
      </Fragment>
    );
  return (
    <div>
      <List>
        {electionList.map((election, index) => (
          <ElectionListElement key={index} index={index} election={election} />
        ))}
      </List>
      <br />
    </div>
  );
};

export default PublicElectionList;
