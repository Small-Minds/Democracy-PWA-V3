import { AxiosResponse } from 'axios';
import { createContext } from 'react';
import { api, preRequestRefreshAuth } from '../API';

const meUrl = `/api/users/me/`;
const userUrl = `/api/users/`;
const updatePasswordUrl = `/rest-auth/password/change/`;
const resetPasswordUrl = `/rest-auth/password/reset/confirm/`;
const requestPasswordResetUrl = `/rest-auth/password/reset/`;

export type UserInfo = {
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  name: string | undefined;
};

export async function getUserInfo(): Promise<UserInfo> {
  const token: string = await preRequestRefreshAuth();
  return api
    .get(meUrl, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res: AxiosResponse) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Can't get ME data.");
      return {};
    });
}

export async function updateName(formData: any): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.patch(userUrl, formData, {
    headers: { Authorization: `JWT ${token}` },
  });
}

export async function updatePassword(formData: any): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.post(updatePasswordUrl, formData, {
    headers: { Authorization: `JWT ${token}` },
  });
}

export async function requestPasswordReset(
  formData: any
): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.post(requestPasswordResetUrl, formData, {});
}

export async function resetPassword(formData: any): Promise<AxiosResponse> {
  const token = await preRequestRefreshAuth();
  return api.post(resetPasswordUrl, formData, {});
}

/**
 * User Context
 */

export const blankUserInfo: UserInfo = {
  id: undefined,
  username: undefined,
  email: undefined,
  name: undefined,
};

export interface UserDataInterface {
  user: UserInfo;
  setUser: (x: UserInfo) => void;
}

// Context Object
export const User = createContext<UserDataInterface | null>(null);
