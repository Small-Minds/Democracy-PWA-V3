import moment from 'moment';
import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Fade } from 'react-awesome-reveal';
import Gravatar from 'react-gravatar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  FlexboxGrid,
  Icon,
  IconButton,
  List,
  Message,
  Placeholder,
} from 'rsuite';
import Loading from '../pages/Loading';
import {
  CandidateWithUserDetails,
  ElectionDetails,
  getPositionDetails,
  Position,
} from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';
import { Credentials } from '../utils/Authentication';

interface PLProps {
  election: ElectionDetails;
}

interface PositionDisplayProps {
  position: Position;
}

const CandidateListItem: FC<{ candidate: CandidateWithUserDetails }> = ({
  candidate,
}) => {
  const userImage = useMemo(() => {
    if (!candidate || !candidate.user || !candidate.user.email) return null;
    return <Gravatar email={candidate.user.email} size={40} rating="pg" />;
  }, [candidate]);

  if (!candidate || !candidate.user || !candidate.user.email) return null;
  return (
    <Fragment>
      <FlexboxGrid justify="start" align="middle" style={{ marginBottom: 10 }}>
        <FlexboxGrid.Item style={{ paddingRight: 10 }}>
          <Avatar>
            {userImage && (
              <Fade triggerOnce duration={600}>
                {userImage}
              </Fade>
            )}
          </Avatar>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item componentClass={'div'}>
          <h5>{candidate.user.name}</h5>
          <p>
            <code>{candidate.user.email}</code>
          </p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <div>
        {candidate.platform.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </Fragment>
  );
};

const PlatformDisplay: FC<PositionDisplayProps> = ({ position }) => {
  const [candidates, setCandidates] = useState<CandidateWithUserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!position) return;
    getPositionDetails(position.id).then((details) => {
      setCandidates(details.candidates);
      setLoading(false);
    });
  }, [position]);
  const [t] = useTranslation();

  if (loading) return <Loading half />;

  return (
    <Fragment>
      <Fade cascade triggerOnce damping={0.1} duration={200}>
        <br />
        <h3>{position.title}</h3>
        <p>
          <i>{position.description}</i>
        </p>
        <br />
        <h4>
          {candidates.length !== 0
            ? t('platformList.title')
            : t('platformList.emptyTitle')}
        </h4>
        <List style={{ marginTop: 10, marginBottom: 20 }}>
          {loading && (
            <List.Item>
              <Placeholder.Paragraph rows={3} active />
            </List.Item>
          )}
          <Fade cascade triggerOnce damping={0.1} duration={200} delay={100}>
            {candidates.map((candidate, index) => (
              <List.Item key={index}>
                <CandidateListItem candidate={candidate} />
              </List.Item>
            ))}
          </Fade>
        </List>
      </Fade>
    </Fragment>
  );
};

const PlatformList: FC<PLProps> = ({ election }) => {
  const ctx = useContext(Credentials);
  const user = useContext(User);
  const history = useHistory();
  const [t] = useTranslation();

  // Ensure all prerequisites are met.
  if (!user || !ctx || !election) return null;

  const manager = useMemo(() => user.user.id === election.manager.id, [
    election,
    user,
  ]);

  const hide: boolean = useMemo(() => {
    if (election.submission_release_time) {
      return moment(election.submission_release_time).isAfter(moment());
    } else {
      return moment(election.submission_end_time).isAfter(moment());
    }
  }, [election]);

  const review: boolean = useMemo(() => {
    if (election.submission_release_time) {
      return (
        moment(election.submission_release_time).isAfter(moment()) &&
        moment(election.submission_end_time).isBefore(moment())
      );
    }
    return false;
  }, [election]);

  /**
   * Hide platforms from users during review period.
   */
  if (!manager && hide && review)
    return (
      <div>
        <p>{t('v2.platformList.willShowAfterReview')}</p>
      </div>
    );

  /**
   * Hide platforms from users during application period.
   */
  if (!manager && hide)
    return (
      <div>
        <p>{t('v2.platformList.willShowAfterApplications')}</p>
        <br />
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item style={{ padding: 30 }}>
            <IconButton
              size="lg"
              icon={<Icon icon="cubes" />}
              onClick={() => history.push(`/election/${election.id}/positions`)}
            >
              {t('electionPage.openPositionBtn')}
            </IconButton>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    );

  return (
    <div>
      {hide && manager && (
        <Fragment>
          <br />
          <Message
            type="warning"
            showIcon
            description={t('v2.platformList.notVisibleWarning')}
          />
          <br />
        </Fragment>
      )}
      {election.positions.length !== 0 ? (
        <Fragment>
          <Fade cascade triggerOnce damping={0.1} duration={200} delay={100}>
            {election.positions.map((position, index) => (
              <PlatformDisplay key={index} position={position} />
            ))}
          </Fade>
        </Fragment>
      ) : (
        <FlexboxGrid>
          <p>{t('platformList.emptyPosition')}</p>
        </FlexboxGrid>
      )}
    </div>
  );
};

export default PlatformList;
