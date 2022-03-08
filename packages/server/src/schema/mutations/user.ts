import { Context } from "@/context";
import { hashPassword, setFingerprintCookieAndSignJwt, uuidv4 } from "@/utils/crypto";
import crypto from 'crypto';
import { arg, nonNull, ObjectDefinitionBlock } from "nexus/dist/core";

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
      const user = await context.prisma.user.findFirst({
        where: {
          email: args.data.email
        }
      })
      if (user) {
        throw new Error(`User with Email: ${args.data.email} already Exists`);
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

}