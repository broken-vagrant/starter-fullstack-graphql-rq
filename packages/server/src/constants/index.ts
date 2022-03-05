
export const isProd = process.env.NODE_ENV === 'production' ? true : false;

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not provided!')
  }
  return secret;
};