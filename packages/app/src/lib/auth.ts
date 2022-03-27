import { getJwtToken } from '@/utils/jwt';
import TokenRefresher from './TokenRefresher';

function getHeaders() {
  const headers: HeadersInit = {};
  const token = getJwtToken();

  if (token) headers['authorization'] = `Bearer ${token}`;
  headers['content-type'] = 'application/json';
  return headers;
}

export const tokenRefresher = new TokenRefresher(1);

export const getDefaultFetchOptions = async (): Promise<RequestInit> => {
  return {
    // credentials: "include" is REQUIRED for cookies to work
    credentials: 'include',
    headers: {
      ...getHeaders(),
    },
  };
};
