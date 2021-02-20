import { AxiosResponse } from 'axios';
import { createContext } from 'react';
import { api, preRequestRefreshAuth } from '../API';

const userUrl = `/api/users/me/`;

export type UserInfo = {
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  name: string | undefined;
};

export async function getUserInfo(): Promise<UserInfo> {
  const token: string = await preRequestRefreshAuth();
  return api
    .get(userUrl, {
      headers: { Authorization: `JWT ${token}` },
    })
    .then((res: AxiosResponse) => {
      return res.data;
    })
    .catch((err) => {
      console.log("Can't get your ME data.");
      return {};
    });
}

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
