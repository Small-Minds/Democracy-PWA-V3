import { AxiosResponse } from 'axios';
import { api, preRequestRefreshAuth } from '../API';
import { Notification } from 'rsuite';
import { UserInfo } from './User';
const electionURL = `/elections/manage/election/`;
const electionPositionURL = `/elections/manage/position/`;
const electionParticipationURL = `/elections/participate/election/`;
const electionParticipationPositionURL = `/elections/participate/position/`;

export type EmptyElection = {
  id: string;
  created: Date;
  title: string;
  description: string;
};

export type Election = {
  created: string;
  description: string;
  election_email_domain: string;
  enable_multiple_submissions: boolean;
  id: string;
  manager: string;
  positions: Array<string>;
  submission_end_time: string;
  submission_start_time: string;
  title: string;
  voting_end_time: string;
  voting_start_time: string;
};

export type ElectionDetails = {
  created: string;
  description: string;
  election_email_domain: string;
  enable_multiple_submissions: boolean;
  id: string;
  manager: string;
  positions: Array<Position>;
  submission_end_time: string;
  submission_start_time: string;
  title: string;
  voting_end_time: string;
  voting_start_time: string;
  voting_open: boolean;
  applications_open: boolean;
  domain_match: boolean;
};

export type CandidateWithUserDetails = {
  id: string;
  user: UserInfo;
  platform: string;
  position: string;
};

export type PositionDetails = {
  id: string;
  candidates: CandidateWithUserDetails[];
  title: string;
  description: string;
  election: string;
};

export type CreateElectionParams = {
  title: string;
  description: string;
  election_email_domain: string;
  enable_multiple_submissions: boolean;
  submission_end_time: Date;
  submission_start_time: Date;
  voting_end_time: Date;
  voting_start_time: Date;
};

export async function create(
  formData: CreateElectionParams
): Promise<EmptyElection> {
  const token = await preRequestRefreshAuth();
  return api
    .post(electionURL, formData, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      const election: EmptyElection = res.data;
      return election;
    });
}

export async function getPublicElectionList(): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.get(electionParticipationURL, {
    headers: { Authorization: `JWT ${token}` },
  });
}

export async function getElectionList(): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.get(electionURL, {
    headers: { Authorization: `JWT ${token}` },
  });
}

export async function getElection(
  electionId: string
): Promise<ElectionDetails> {
  const token = await preRequestRefreshAuth();
  let config = {
    headers: { Authorization: `JWT ${token}` },
  };
  const res: AxiosResponse = await api.get(
    electionParticipationURL + electionId,
    config
  );
  return res.data;
}

export async function deleteElection(electionId: string): Promise<Number> {
  const token = await preRequestRefreshAuth();
  return api
    .delete(electionURL + electionId, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      if (res.status == 204) {
        Notification['success']({
          title: 'Success',
          description: 'The election is deleted successfully',
        });
      }
      return res.status;
    });
}

export async function updateOldElection(
  newElectionDetails: ElectionDetails
): Promise<Number> {
  const token = await preRequestRefreshAuth();
  return api
    .patch(electionURL + newElectionDetails.id + `/`, newElectionDetails, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      if (res.status != 200) {
        Notification['error']({
          title: 'Failed',
          description: 'Failed to update the election',
        });
      }
      return res.status;
    });
}

export async function deletePosition(positionId: string): Promise<Number> {
  const token = await preRequestRefreshAuth();
  return api
    .delete(electionPositionURL + positionId, {
      headers: { Authorization: `JWT  ${token}` },
    })
    .then((res) => {
      if (res.status == 204) {
        Notification['success']({
          title: 'Success',
          description: 'The election is deleted successfully',
        });
      }
      return res.status;
    });
}

export async function getPositionDetails(
  positionId: string
): Promise<PositionDetails> {
  const token = await preRequestRefreshAuth();
  let config = {
    headers: { Authorization: `JWT ${token}` },
  };
  const res: AxiosResponse = await api.get(
    electionParticipationPositionURL + positionId,
    config
  );
  return res.data;
}

/**
 * CANDIDATES
 */

export type Candidate = {
  id: string;
  created: string;
  position: string;
  platform: string;
};

/**
 * POSITIONS
 */

const positionManagementUrl = `/elections/manage/position/`;

export type CreatePositionParams = {
  title: string;
  description: string;
  election: string;
};

export type Position = {
  id: string;
  candidates: Candidate[];
  title: string;
  description: string;
  election: string;
};

export async function createPosition(
  formData: CreatePositionParams
): Promise<Position> {
  const token = await preRequestRefreshAuth();
  return api
    .post(positionManagementUrl, formData, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      const p: Position = res.data;
      return p;
    });
}

// 83962581-34d5-473f-a398-8c2b0c91af44
