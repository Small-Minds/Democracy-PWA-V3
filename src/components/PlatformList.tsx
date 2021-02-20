import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Gravatar from 'react-gravatar';
import { useHistory } from 'react-router-dom';
import { Avatar, FlexboxGrid, List, Placeholder } from 'rsuite';
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
    return (
      <Avatar>
        <Gravatar email={candidate.user.email} size={40} rating="pg" />
      </Avatar>
    );
  }, [candidate]);

  if (!candidate || !candidate.user || !candidate.user.email) return null;
  return (
    <Fragment>
      <FlexboxGrid justify="start" align="top">
        <FlexboxGrid.Item style={{ paddingRight: 10 }}>
          {userImage}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <h5>{candidate.user.name}</h5>
          {candidate.platform.split('\n').map((line, index) => (
            <p key={index}>
              <i>{line}</i>
            </p>
          ))}
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Fragment>
  );
};

const PlatformDisplay: FC<PositionDisplayProps> = ({ position }) => {
  const [candidates, setCandidates] = useState<CandidateWithUserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getPositionDetails(position.id).then((details) => {
      setCandidates(details.candidates);
      setLoading(false);
    });
  }, [position]);

  return (
    <Fragment>
      <br />
      <h3>{position.title}</h3>
      <p>
        <i>{position.description}</i>
      </p>
      <br />
      <h4>{candidates.length !== 0 ? 'Candidates' : 'No Candidates'}</h4>
      <List style={{ marginTop: 10, marginBottom: 20 }}>
        {loading && (
          <List.Item>
            <Placeholder.Paragraph rows={3} active />
          </List.Item>
        )}
        {candidates.map((candidate, index) => (
          <List.Item key={index}>
            <CandidateListItem candidate={candidate} />
          </List.Item>
        ))}
      </List>
    </Fragment>
  );
};

const PlatformList: FC<PLProps> = ({ election }) => {
  const ctx = useContext(Credentials);
  const user = useContext(User);
  const history = useHistory();

  // Ensure all prerequisites are met.
  if (!user || !ctx || !election) return null;

  const showDelete = user.user.id === election.manager.id;

  return (
    <div>
      {election.positions.length !== 0 ? (
        <Fragment>
          {election.positions.map((position, index) => (
            <PlatformDisplay key={index} position={position} />
          ))}
        </Fragment>
      ) : (
        <FlexboxGrid>
          <p>No positions posted yet. Check back soon for updates.</p>
        </FlexboxGrid>
      )}
    </div>
  );
};

export default PlatformList;
