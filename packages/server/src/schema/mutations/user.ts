import { arg, nonNull, ObjectDefinitionBlock } from "nexus/dist/core"
import crypto from 'crypto';
import { Context } from "@/context"
import { checkPassword, FINGERPRINT_COOKIE_NAME, hashPassword, sha256, uuidv4 } from "@/utils/crypto";
import { setFingerprintCookieAndSignJwt } from "@/utils/crypto";
import { AuthenticationError } from "apollo-server";
import tokenGenerator from "@/utils/TokenGenerator";

export default function userMutationDef(t: ObjectDefinitionBlock<'Mutation'>) {
  t.nonNull.field('signupUser', {
    type: 'UserAuthResponse',
    args: {
      data: nonNull(
        arg({
          type: 'UserCreateWhereInput',
        }),
      ),
    },
    resolve: async (_, args, context: Context) => {
      const postData = args.data.posts?.map((post) => {
        return { title: post.title, content: post.content || undefined }
      })
      const user = await context.prisma.user.findFirst({
        where: {
          email: args.data.email
        }
      })
      if (user) {
        throw new Error(`user with email: ${args.data.email} already Exists`);
      }
      const { email, name, password } = args.data;

      const refreshToken = uuidv4();

      const newUser = await context.prisma.user.create({
        data: {
          name,
          email,
          passwordHash: await hashPassword(password),
          posts: {
            create: postData,
          },
        },
      })

      // Generate a random string that will constitute the fingerprint for this user
      const fingerprint = crypto.randomBytes(50).toString("hex")
      // Add the fingerprint in a hardened cookie to prevent Token Sidejacking
      // https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking
      const jwt = setFingerprintCookieAndSignJwt(fingerprint, context.res, newUser)

      return {
        jwt,
        refreshToken
      }
    },
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
        throw new AuthenticationError(`user with email: ${email} doesn't Exist`);
      }
      const validPassword = await checkPassword(password, user.passwordHash);

      if (!validPassword) {
        throw new AuthenticationError(`Invalid credentials`);
      }
      // Update user refresh token and refresh token expiration
      const refreshToken = uuidv4()
      console.log("updating user refresh token", refreshToken)
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

      console.log("returning jwt", jwt)
      return {
        jwt, refreshToken
      };
    }
  })
  t.field('refreshToken', {
    type: 'UserAuthResponse',
    args: {
      data: nonNull(arg({ type: 'RefreshTokenInput' }))
    },
    resolve: async (_, args, context) => {
      const { refreshToken, fingerPrintHash } = args.data;

      const fingerprintCookie = context.req.cookies[FINGERPRINT_COOKIE_NAME];
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