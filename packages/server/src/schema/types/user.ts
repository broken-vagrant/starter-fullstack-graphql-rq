import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { Context } from '@/context';
import {
  FINGERPRINT_COOKIE_NAME,
  getRefreshTokenExpiryTime,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} from '@/constants';
import { getCookie } from '@/utils';
import {
  uuidv4,
  hashPassword,
  setFingerprintCookieAndSignJwt,
  checkPassword,
  sha256,
} from '@/utils/crypto';
import tokenGenerator from '@/utils/TokenGenerator';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { serialize } from 'cookie';
import crypto from 'crypto';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.nonNull.string('passwordHash');
    t.string('refreshToken');
    t.date('refreshTokenExpiresAt');
    t.nonNull.list.field('posts', {
      type: 'Post',
      resolve: (parent, _, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .posts();
      },
    });
  },
});
export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id');
    t.string('email');
  },
});
export const BaseUser = objectType({
  name: 'BaseUser',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('email');
    t.nonNull.string('name');
  },
});

export const UserCreateWhereInput = inputObjectType({
  name: 'UserCreateWhereInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('name');
    t.nonNull.string('password');
  },
});

export const UserLoginInput = inputObjectType({
  name: 'UserLoginInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
  },
});

export const UserAuthResponse = objectType({
  name: 'UserAuthResponse',
  definition(t) {
    t.nonNull.string('jwt');
    t.nonNull.string('refreshToken');
  },
});
export const RefreshTokenResponse = objectType({
  name: 'RefreshTokenResponse',
  definition(t) {
    t.nonNull.string('jwt');
  },
});

export const RefreshTokenInput = inputObjectType({
  name: 'RefreshTokenInput',
  definition(t) {
    t.nonNull.string('refreshToken');
    t.nonNull.string('fingerPrintHash');
  },
});

export const userQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('whoami', {
      type: 'BaseUser',
      resolve: async (_, _args, context) => {
        if (!context.user) {
          return null;
        }

        const user = await context.prisma.user.findUnique({
          where: {
            id: context.user.id,
          },
          select: {
            email: true,
            id: true,
            name: true,
          },
        });
        if (!user) {
          return null;
        }
        return user;
      },
    });

    t.nonNull.list.nonNull.field('allUsers', {
      type: 'BaseUser',
      resolve: (_parent, _args, context: Context) => {
        if (!context.user) {
          throw new AuthenticationError('Invalid Credentials');
        }
        return context.prisma.user.findMany({
          select: {
            email: true,
            id: true,
            name: true,
          },
          take: 5,
        });
      },
    });
  },
});
export const userMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('signupUser', {
      type: 'UserAuthResponse',
      args: {
        data: nonNull(
          arg({
            type: 'UserCreateWhereInput',
          })
        ),
      },
      resolve: async (_, args, context: Context) => {
        const user = await context.prisma.user.findFirst({
          where: {
            email: args.data.email,
          },
        });
        if (user) {
          throw new UserInputError(`user already exists`);
        }
        const { email, name, password } = args.data;

        const refreshToken = uuidv4();

        const newUser = await context.prisma.user.create({
          data: {
            name,
            email,
            passwordHash: await hashPassword(password),
            posts: {
              create: [],
            },
          },
        });

        // Generate a random string that will constitute the fingerprint for this user
        const fingerprint = crypto.randomBytes(50).toString('hex');
        // Add the fingerprint in a hardened cookie to prevent Token Sidejacking
        // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
        const jwt = setFingerprintCookieAndSignJwt(
          fingerprint,
          context.res,
          newUser
        );

        return {
          jwt,
          refreshToken,
        };
      },
    });

    t.nonNull.field('logout', {
      type: objectType({
        name: 'LogoutResponse',
        definition(t) {
          t.nonNull.boolean('ok');
        },
      }),
      resolve: (_, _args, context) => {
        context.res.setHeader(
          'Set-Cookie',
          serialize(FINGERPRINT_COOKIE_NAME, '', {
            maxAge: -1,
            path: '/',
          })
        );
        return {
          ok: true,
        };
      },
    });

    t.field('login', {
      type: 'UserAuthResponse',
      args: {
        data: nonNull(
          arg({
            type: 'UserLoginInput',
          })
        ),
      },
      resolve: async (_, args, context: Context) => {
        const { email, password } = args.data;
        const user = await context.prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user) {
          throw new AuthenticationError('User not found');
        }
        const validPassword = await checkPassword(password, user.passwordHash);

        if (!validPassword) {
          throw new AuthenticationError(`Invalid credentials`);
        }
        // Update user refresh token and refresh token expiration
        const refreshToken = uuidv4();
        await context.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            refreshToken,
            refreshTokenExpiresAt: new Date(
              Date.now() + getRefreshTokenExpiryTime()
            ).toISOString(),
          },
        });
        // //Generate a random string that will constitute the fingerprint for this user
        const fingerprint = crypto.randomBytes(50).toString('hex');

        // Add the fingerprint in a hardened cookie to prevent Token Sidejacking
        // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
        const jwt = setFingerprintCookieAndSignJwt(
          fingerprint,
          context.res,
          user
        );

        return {
          jwt,
          refreshToken,
        };
      },
    });

    t.field('refreshToken', {
      type: 'RefreshTokenResponse',
      args: {
        data: nonNull(arg({ type: 'RefreshTokenInput' })),
      },
      resolve: async (_, args, context) => {
        const { refreshToken, fingerPrintHash } = args.data;

        const fingerprintCookie = getCookie(
          context.req.headers.cookie,
          FINGERPRINT_COOKIE_NAME
        );
        console.log({ fingerprintCookie });
        if (!fingerprintCookie)
          throw new AuthenticationError('Unable to refresh JWT token');

        // Compute a SHA256 hash of the received fingerprint in cookie in order to compare
        // it to the fingerprint hash stored in the token
        const fingerprintCookieHash = sha256(fingerprintCookie);
        console.log({
          fingerprintCookie,
          fingerprintCookieHash,
          fingerPrintHash,
        });

        if (fingerPrintHash != fingerprintCookieHash) {
          throw new AuthenticationError('Unable to refresh JWT token');
        }

        const user = await context.prisma.user.findFirst({
          where: {
            refreshToken,
          },
        });
        if (!user) throw new AuthenticationError('User not found');

        await context.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            refreshToken: uuidv4(),
            refreshTokenExpiresAt: new Date(
              Date.now() + getRefreshTokenExpiryTime()
            ).toISOString(),
          },
        });
        const jwt = tokenGenerator.signWithClaims({
          expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
          allowedRoles: ['user'],
          defaultRole: 'user',
          otherClaims: {
            'X-Hasura-User-Id': String(user.id),
          },
        });
        return {
          jwt,
        };
      },
    });
  },
});
