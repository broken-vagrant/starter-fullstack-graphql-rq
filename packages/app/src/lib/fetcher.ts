import { BACKEND_URL } from '@/constants';
import { getDefaultFetchOptions } from './auth';

export function fetcher<TData, TVariables>(
  query: string,
  variables?: TVariables
) {
  return async (): Promise<TData> => {
    const res = await fetch(BACKEND_URL as string, {
      method: 'POST',
      ...(await getDefaultFetchOptions()),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message, extensions } = json.errors[0];
      if (extensions && extensions.code === 'INTERNAL_SERVER_ERROR') {
        throw new Error('Something went wrong!');
      }
      throw new Error(message);
    }

    return json.data;
  };
}
