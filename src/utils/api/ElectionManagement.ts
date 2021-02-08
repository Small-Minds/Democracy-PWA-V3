import { AxiosResponse } from 'axios';
import { api, preRequestRefreshAuth } from '../API';

const electionURL = `/elections/manage/election/`;
const electionParticipationURL = `/elections/participate/election/`;

export type EmptyElection = {
  id: string;
  created: Date;
  title: string;
  description: string;
};

export type Position = {
  id: string;
  candidate: Array<string>;
  title: string;
  description: string;
  election: string;
};

export type Election = {
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

export async function getElection(electionId: string): Promise<Election> {
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
