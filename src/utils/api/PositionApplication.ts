import PositionApply from '../../pages/PositionApply';
import { api, preRequestRefreshAuth } from '../API';

export type Position = {
  id: string;
  title: string;
  description: string;
  election_email_domain: string;
  submission_start_time: string;
  submission_end_time: string;
  voting_start_time: string;
  voting_end_time: string;
  manager: string;
};

export type Candidate = {
  id: string;
  created: string;
  position: string;
  platform: string;
};

export type PositionApplicationParams = {
  platform: string;
  position: string;
};

const positionManagementUrl = `/elections/participate/position/`;
const positionApplicationSubmitUrl = `/elections/participate/candidate/`;
export async function getPosition(positionId: string): Promise<Position> {
  const token = await preRequestRefreshAuth();
  return api
    .get(positionManagementUrl + positionId, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      const p: Position = res.data;
      return p;
    });
}

export async function submitPositionApplication(
  formData: PositionApplicationParams
): Promise<Candidate> {
  const token = await preRequestRefreshAuth();
  return api
    .post(positionApplicationSubmitUrl, formData, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res) => {
      const c: Candidate = res.data;
      return c;
    });
}
