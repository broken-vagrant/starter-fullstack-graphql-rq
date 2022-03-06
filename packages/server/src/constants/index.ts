
export const isProd = process.env.NODE_ENV === 'production' ? true : false;

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not provided!')
  }
  return secret;
};

export const secretOrPrivateKey = process.env.JWT_SECRET_OR_PRIVATE_KEY;

export const secretOrPublicKey = process.env.JWT_SECRET_OR_PUBLIC_KEY;