import React, {
  Fragment,
  FC,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
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
import AddPositionModal from '../components/AddPositionModal';
import ConfirmModal from '../components/ConfirmModal';
import PositionList from '../components/PositionList';
import {
  getElection,
  ElectionDetails,
  deleteElection,
} from '../utils/api/ElectionManagement';
import { User, UserDataInterface } from '../utils/api/User';
import Loading from './Loading';

interface ElectionSubpage {
  id: string | undefined;
  election: ElectionDetails | undefined;
  user: UserDataInterface | null;
  updateElection?: (id: string) => Promise<any>;
}

const ManagementTools: FC<ElectionSubpage> = ({
  id,
  election,
  user,
  updateElection,
}) => {
  const [setTimelineOpen, setSetTimelineOpen] = useState<boolean>(false);
  const [addPositionOpen, setAddPositionOpen] = useState<boolean>(false);
  const [deleteElectionOpen, setDeleteElectionOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  function closeModal() {
    setIsOpen(false);
  }
  if (!id) return null;
  if (!election || election === undefined) return null;

  return (
    <Fragment>
      <h5 style={{ marginBottom: 10 }}>Management Tools</h5>
      <ButtonToolbar>
        <IconButton icon={<Icon icon="clock-o" />}>Set Timeline</IconButton>
        <IconButton
          icon={<Icon icon="plus" />}
          onClick={() => setAddPositionOpen(true)}
        >
          Add Position
        </IconButton>
        <IconButton
          appearance="primary"
          icon={<Icon icon="trash" />}
          color="red"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Delete Election
        </IconButton>
      </ButtonToolbar>
      <ConfirmModal
        modalTitle="Delete Election"
        modalBody="Do you want to delete this election?"
        callBackFunc={() => deleteElection(id)}
        isOpen={isOpen}
        closeModal={() => closeModal()}
      />
      {/* TODO: Add configure times modal. */}
      <AddPositionModal
        open={addPositionOpen}
        setOpen={setAddPositionOpen}
        election={election}
        onCreate={(p) => {
          if (updateElection) updateElection(election.id);
          setAddPositionOpen(false);
        }}
      />
    </Fragment>
  );
};

const Information: FC<ElectionSubpage> = ({ id, election }) => {
  if (!id || !election) return null;
  return (
    <Fragment>
      <h3>Information</h3>
      <br />
      <h4>Positions</h4>
      <br />
      <PositionList election={election} />
      <br />
      <h4>Raw Data</h4>
      <code>
        <pre>{JSON.stringify(election, null, 2)}</pre>
      </code>
    </Fragment>
  );
};

const Positions: FC<ElectionSubpage> = ({ id, election }) => {
  if (!id || !election) return null;
  return (
    <Fragment>
      <h3>Positions</h3>
      <br />
      <PositionList election={election} />
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

  const [showTools, setShowTools] = useState<boolean>(false);
  const [election, setElection] = useState<ElectionDetails>();

  const updateElection = (i: string): Promise<any> => {
    return getElection(i).then((res) => {
      setElection(res);
    });
  };

  // Get Election
  useEffect(() => {
    if (!id) return;
    updateElection(id);
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
              <IconButton
                icon={<Icon icon="info" />}
                onClick={() => history.push(match.url)}
              >
                Information
              </IconButton>
              <IconButton
                icon={<Icon icon="cubes" />}
                onClick={() => history.push(`${match.url}/positions`)}
              >
                Open Positions
              </IconButton>
              <IconButton
                icon={<Icon icon="speaker" />}
                onClick={() => history.push(`${match.url}/platforms`)}
              >
                Candidate Platforms
              </IconButton>
            </ButtonToolbar>
          </Fragment>
          <br />
          {showTools && (
            <Fragment>
              <br />
              <ManagementTools
                id={id}
                election={election}
                user={user}
                updateElection={updateElection}
              />
              <br />
            </Fragment>
          )}
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
