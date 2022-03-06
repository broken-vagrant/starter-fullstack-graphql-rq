import tokenGenerator from './TokenGenerator';

export const getUser = (token: string) => {
  try {
    const decoded: any = tokenGenerator.verify(token);
    const claims = decoded['https://hasura.io/jwt/claims'];

    return {
      id: claims['X-Hasura-User-Id'],
      ...claims
    }
  }
  catch (err) {
    return null;
  }
}

