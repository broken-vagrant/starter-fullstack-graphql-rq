import { Context } from "@/context";
import { getCookie } from "@/utils";
import { checkPassword, setFingerprintCookieAndSignJwt, sha256, uuidv4 } from "@/utils/crypto";
import tokenGenerator from "@/utils/TokenGenerator";
import { AuthenticationError } from "apollo-server";
import { serialize } from "cookie";
import { arg, nonNull, ObjectDefinitionBlock, objectType } from "nexus/dist/core";
import crypto from 'crypto';
import { FINGERPRINT_COOKIE_NAME } from "@/constants";

export default function userQueryDef(t: ObjectDefinitionBlock<'Query'>) {

  t.field('whoami', {
    type: 'User',
    resolve: async (_, _args, context) => {
      if (!context.user) {
        return null;
      }

      const user = await context.prisma.user.findUnique({
        where: {
          id: Number(context.user.id)
        }
      })
      if (!user) {
        return null;
      }
      return user;
    }
  })

  t.nonNull.list.nonNull.field('allUsers', {
    type: 'User',
    resolve: (_parent, _args, context: Context) => {
      return context.prisma.user.findMany()
    },
  })

  t.nonNull.field('logout', {
    type: objectType({
      name: 'LogoutResponse',
      definition(t) {
        t.nonNull.boolean('ok')
      }
    }),
    resolve: (_, _args, context) => {
      context.res.setHeader(
        "Set-Cookie",
        serialize(FINGERPRINT_COOKIE_NAME, "", {
          maxAge: -1,
          path: "/",
        })
      )
      return {
        ok: true
      }
    }
  })

  t.field('login', {
    type: 'UserAuthResponse',
    args: {
      data: nonNull(
        arg({
          type: 'UserLoginInput',
        }))
    },
    resolve: async (_, args, context: Context) => {
      const { email, password } = args.data;
      const user = await context.prisma.user.findFirst({
        where: {
          email
        }
      })
      if (!user) {
        throw new AuthenticationError("User not found");
      }
      const validPassword = await checkPassword(password, user.passwordHash);

      if (!validPassword) {
        throw new AuthenticationError(`Invalid credentials`);
      }
      // Update user refresh token and refresh token expiration
      const refreshToken = uuidv4()
      await context.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          refreshToken,
          // 1 hour, UTC time in ISO format
          refreshTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString()
        }
      })
      // //Generate a random string that will constitute the fingerprint for this user
      const fingerprint = crypto.randomBytes(50).toString("hex")

      // Add the fingerprint in a hardened cookie to prevent Token Sidejacking
      // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
      const jwt = setFingerprintCookieAndSignJwt(fingerprint, context.res, user)

      return {
        jwt, refreshToken
      };
    }
  })

  t.field('refreshToken', {
    type: 'RefreshTokenResponse',
    args: {
      data: nonNull(arg({ type: 'RefreshTokenInput' }))
    },
    resolve: async (_, args, context) => {
      const { refreshToken, fingerPrintHash } = args.data;


      const fingerprintCookie = getCookie(context.req.headers.cookie, FINGERPRINT_COOKIE_NAME);
      console.log({ fingerprintCookie })
      if (!fingerprintCookie) throw new AuthenticationError('Unable to refresh JWT token');

      // Compute a SHA256 hash of the received fingerprint in cookie in order to compare
      // it to the fingerprint hash stored in the token
      const fingerprintCookieHash = sha256(fingerprintCookie)
      console.log({ fingerprintCookie, fingerprintCookieHash, fingerPrintHash })

      if (fingerPrintHash != fingerprintCookieHash) {
        throw new AuthenticationError('Unable to refresh JWT token')
      }

      const user = await context.prisma.user.findFirst({
        where: {
          refreshToken
        }
      })
      if (!user) throw new AuthenticationError('User not found');

      await context.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          refreshToken: uuidv4(),
          refreshTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(),
        }
      })
      const jwt = tokenGenerator.signWithClaims({
        expiresIn: "5m",
        allowedRoles: ["user"],
        defaultRole: "user",
        otherClaims: {
          "X-Hasura-User-Id": String(user.id),
        },
      })
      return {
        jwt
      }
    }
  })

}
