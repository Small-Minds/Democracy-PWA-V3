import React, { Fragment, FC, useState, useEffect, useContext } from 'react';
import {
  RouteComponentProps,
  useParams,
  Switch,
  Route,
  useHistory,
  Link,
} from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  FlexboxGrid,
  Icon,
  IconButton,
} from 'rsuite';
import {
  getElection,
  Election as ElectionType,
} from '../utils/api/ElectionManagement';
import { User, UserDataInterface } from '../utils/api/User';
import Loading from './Loading';

interface ElectionSubpage {
  id: string | undefined;
  election: ElectionType | undefined;
  user: UserDataInterface | null;
}

const Information: FC<ElectionSubpage> = ({ id, election }) => {
  if (!id) return null;
  return (
    <Fragment>
      <h3>Information</h3>
      <code>
        <pre>{JSON.stringify(election, null, 2)}</pre>
      </code>
    </Fragment>
  );
};

const Positions: FC<ElectionSubpage> = ({ id }) => {
  if (!id) return null;
  return (
    <Fragment>
      <h3>Positions for {id}</h3>
    </Fragment>
  );
};

const Platforms: FC<ElectionSubpage> = ({ id }) => {
  if (!id) return null;
  return (
    <Fragment>
      <h3>Platforms for {id}</h3>
    </Fragment>
  );
};

const Election: FC<RouteComponentProps> = ({ match }) => {
  const { id } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const user = useContext(User);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [showTools, setShowTools] = useState<boolean>(false);
  const [election, setElection] = useState<ElectionType>();

  // Get Election
  useEffect(() => {
    if (!id) return;
    getElection(id).then((res) => {
      console.log(res);
      setElection(res);
      setLoading(false);
    });
  }, [id]);

  // Show Management Tools
  useEffect(() => {
    if (!id) return;
    if (!election) return;
    setShowTools(user?.user.id === election.manager);
  }, [id, election, user]);

  // Return to the previous page if no ID is provided.
  if (!id || id === undefined) {
    history.goBack();
    return null;
  }

  return (
    <Fragment>
      {election ? (
        <Fragment>
          <h1>{election.title}</h1>
          <p>
            <b>@{election.election_email_domain}</b>
            &nbsp;&middot;&nbsp;
            <span>{election.description}</span>
          </p>
          <br />
          <Fragment>
            <ButtonToolbar>
              <IconButton
                appearance="primary"
                icon={<Icon icon="check2" />}
                onClick={() => history.push(`${match.url}/vote`)}
              >
                Vote
              </IconButton>
              <IconButton
                appearance="primary"
                icon={<Icon icon="list" />}
                onClick={() => history.push(`${match.url}/positions`)}
                color="green"
              >
                Apply Now
              </IconButton>
              <Button onClick={() => history.push(match.url)}>
                Information
              </Button>
              <Button onClick={() => history.push(`${match.url}/positions`)}>
                Open Positions
              </Button>
              <Button onClick={() => history.push(`${match.url}/platforms`)}>
                Candidate Platforms
              </Button>
            </ButtonToolbar>
          </Fragment>
          <br />
          <br />
          {showTools && (
            <Fragment>
              <h5 style={{ marginBottom: 10 }}>Management Tools</h5>
              <ButtonToolbar>
                <IconButton icon={<Icon icon="clock-o" />}>
                  Set Timeline
                </IconButton>
                <IconButton icon={<Icon icon="plus" />}>
                  Add Position
                </IconButton>
                <IconButton
                  appearance="primary"
                  icon={<Icon icon="trash" />}
                  color="red"
                >
                  Delete Election
                </IconButton>
              </ButtonToolbar>
            </Fragment>
          )}
          <br />
          <br />
          <Switch>
            {/* Positions*/}
            <Route path={`${match.url}/positions`}>
              <Positions id={id} election={election} user={user} />
            </Route>
            {/* Platforms */}
            <Route path={`${match.url}/platforms`}>
              <Platforms id={id} election={election} user={user} />
            </Route>
            {/* Info */}
            <Route path={match.url}>
              <Information id={id} election={election} user={user} />
            </Route>
          </Switch>
        </Fragment>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
};

export default Election;
