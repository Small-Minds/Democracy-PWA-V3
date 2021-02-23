import React, {
  Fragment,
  FC,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  RouteComponentProps,
  useParams,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { ButtonToolbar, Icon, IconButton, Message, Notification } from 'rsuite';
import AddPositionModal from '../components/AddPositionModal';
import ConfirmModal from '../components/ConfirmModal';
import ElectionTimeline from '../components/ElectionTimeline';
import PlatformList from '../components/PlatformList';
import PositionList from '../components/PositionList';
import SetTimelineModal from '../components/SetTimelineModal';
import {
  getElection,
  ElectionDetails,
  deleteElection,
} from '../utils/api/ElectionManagement';
import { User, UserDataInterface } from '../utils/api/User';
import Loading from './Loading';
import moment from 'moment';
import ElectionResults from '../components/ElectionResults';
import ElectionManager from '../components/ElectionManager';
import { useTranslation } from 'react-i18next';

interface ElectionSubpage {
  id: string | undefined;
  election: ElectionDetails | undefined;
  user: UserDataInterface | null;
  updateElection?: (id: string) => Promise<any>;
  finished?: boolean;
}

const ManagementTools: FC<ElectionSubpage> = ({
  id,
  election,
  updateElection,
  finished,
}) => {
  const [setTimelineOpen, setSetTimelineOpen] = useState<boolean>(false);
  const [addPositionOpen, setAddPositionOpen] = useState<boolean>(false);
  const [
    isDeleteElectionModalOpen,
    setIsDeleteElectionModalOpen,
  ] = useState<boolean>(false);
  const history = useHistory();
  const [t] = useTranslation();
  function closeDeleteElectionModal() {
    setIsDeleteElectionModalOpen(false);
  }

  function deleteElectionHandler(result: number) {
    if (result == 204) {
      setIsDeleteElectionModalOpen(false);
      Notification['success']({
        title: 'Success',
        description: 'The election has been successfully updated',
      });
      history.push(`/`);
    } else {
      setIsDeleteElectionModalOpen(false);
      Notification['error']({
        title: 'Error',
        description: 'Failed to update the election',
      });
    }
  }

  if (!id || !election || election === undefined) return null;
  return (
    <Fragment>
      <h5 style={{ marginBottom: 10 }}>
        {t('electionPage.managementToolsSectionTitle')}
      </h5>
      <ButtonToolbar>
        <IconButton
          icon={<Icon icon="clock-o" />}
          onClick={() => setSetTimelineOpen(true)}
        >
          {t('electionPage.setTimelineBtn')}
        </IconButton>
        {finished !== true && (
          <IconButton
            icon={<Icon icon="plus" />}
            onClick={() => setAddPositionOpen(true)}
          >
            {t('electionPage.addPositionBtn')}
          </IconButton>
        )}
        <IconButton
          appearance="primary"
          icon={<Icon icon="trash" />}
          color="red"
          onClick={() => {
            setIsDeleteElectionModalOpen(true);
          }}
        >
          {t('electionPage.deleteEletionBtn')}
        </IconButton>
      </ButtonToolbar>
      <ConfirmModal
        modalTitle={t('electionPage.deleteElectionModalTitle')}
        modalBody={t('electionPage.deleteElectionModalBody')}
        callBackFunc={() => deleteElection(id)}
        isOpen={isDeleteElectionModalOpen}
        closeModal={() => closeDeleteElectionModal()}
        cleanUpFunc={(result: number) => deleteElectionHandler(result)}
      />
      <SetTimelineModal
        election={election}
        isOpen={setTimelineOpen}
        closeModal={() => setSetTimelineOpen(false)}
        cleanupFunc={() => {
          if (updateElection) updateElection(election.id);
        }}
      />
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

const Information: FC<ElectionSubpage> = ({ id, election, updateElection }) => {
  if (!id || !election) return null;
  const [t] = useTranslation();
  return (
    <Fragment>
      <h3>{t('electionPage.infoSubpageTitle')}</h3>
      <br />
      <ElectionManager election={election} />
      <br />
      <br />
      <ElectionTimeline election={election} />
      <br />
      <h4>{t('electionPage.infoSubpagePostionSectionTitle')}</h4>
      <br />
      <PositionList
        election={election}
        updateElection={() => {
          if (updateElection) updateElection(election.id);
        }}
      />
      <br />
      <h4>Raw Data</h4>
      <code>
        <pre>{JSON.stringify(election, null, 2)}</pre>
      </code>
    </Fragment>
  );
};

const Positions: FC<ElectionSubpage> = ({ id, election, updateElection }) => {
  if (!id || !election) return null;
  const [t] = useTranslation();
  return (
    <Fragment>
      <h3>{t('electionPage.positionSectionTilte')}</h3>
      <br />
      <PositionList
        election={election}
        updateElection={() => {
          if (updateElection) updateElection(election.id);
        }}
      />
    </Fragment>
  );
};

const Platforms: FC<ElectionSubpage> = ({ id, election }) => {
  if (!id || !election) return null;
  const [t] = useTranslation();
  return (
    <Fragment>
      <h3>{t('electionPage.platformSectionTitle')}</h3>
      <PlatformList election={election} />
    </Fragment>
  );
};

const Election: FC<RouteComponentProps> = ({ match }) => {
  const { id } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const user = useContext(User);
  const [t] = useTranslation();
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
    setShowTools(user?.user.id === election.manager.id);
  }, [id, election, user]);

  // Return to the previous page if no ID is provided.
  if (!id || id === undefined) {
    history.goBack();
    return null;
  }

  if (!id || !election || election === undefined)
    return (
      <Fragment>
        <Loading />
      </Fragment>
    );

  if (moment(election.voting_end_time) < moment()) {
    return (
      <Fragment>
        <h1>{election.title}</h1>
        <p>
          <b>@{election.election_email_domain}</b>
          &nbsp;&middot;&nbsp;
          <span>{election.description}</span>
        </p>
        <br />
        <h2>{t('electionPage.resultSectionTitle')}</h2>
        {showTools && (
          <Fragment>
            <br />
            <ManagementTools
              id={id}
              election={election}
              user={user}
              updateElection={updateElection}
              finished={true}
            />
            <br />
          </Fragment>
        )}
        <ElectionResults />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h1>{election.title}</h1>
      <p>
        <b>@{election.election_email_domain}</b>
        &nbsp;&middot;&nbsp;
        <span>{election.description}</span>
      </p>
      <br />
      {election && election.domain_match === false && (
        <Fragment>
          <Message
            type="error"
            showIcon
            description={
              t('electionPage.electionDomainErrorMsg') +
              `  @${election.election_email_domain}`
            }
          />
          <br />
        </Fragment>
      )}
      <Fragment>
        <ButtonToolbar>
          <IconButton
            appearance="primary"
            icon={<Icon icon="check2" />}
            onClick={() => history.push(`${match.url}/vote`)}
            disabled={!election.voting_open || !election.domain_match}
          >
            {t('electionPage.voteBtn')}
          </IconButton>
          <IconButton
            appearance="primary"
            icon={<Icon icon="list" />}
            onClick={() => history.push(`${match.url}/positions`)}
            color="green"
            disabled={!election.applications_open || !election.domain_match}
          >
            {t('electionPage.applyBtn')}
          </IconButton>
          <IconButton
            icon={<Icon icon="info" />}
            onClick={() => history.push(match.url)}
          >
            {t('electionPage.infoBtn')}
          </IconButton>
          <IconButton
            icon={<Icon icon="cubes" />}
            onClick={() => history.push(`${match.url}/positions`)}
          >
            {t('electionPage.openPositionBtn')}
          </IconButton>
          <IconButton
            icon={<Icon icon="speaker" />}
            onClick={() => history.push(`${match.url}/platforms`)}
          >
            {t('electionPage.platformBtn')}
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
            finished={false}
          />
          <br />
        </Fragment>
      )}
      <br />
      <Switch>
        {/* Positions*/}
        <Route path={`${match.url}/positions`}>
          <Positions
            id={id}
            election={election}
            user={user}
            updateElection={updateElection}
          />
        </Route>
        {/* Platforms */}
        <Route path={`${match.url}/platforms`}>
          <Platforms id={id} election={election} user={user} />
        </Route>
        {/* Info */}
        <Route path={match.url}>
          <Information
            id={id}
            election={election}
            user={user}
            updateElection={updateElection}
          />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default Election;
