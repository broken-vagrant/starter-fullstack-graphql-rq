import { Context } from "@/context";
import { FINGERPRINT_COOKIE_NAME } from "@/utils/crypto";
import { AuthenticationError } from "apollo-server-core";
import { serialize } from "cookie";
import { ObjectDefinitionBlock, objectType } from "nexus/dist/core";

export default function userQueryDef(t: ObjectDefinitionBlock<'Query'>) {

  t.field('whoami', {
    type: 'User',
    resolve: async (_, _args, context) => {
      console.log("FingerPrint OBject:", context.user);

      if (!context.user) {
        throw new AuthenticationError('Invalid Token')
      }
      const user = await context.prisma.user.findUnique({
        where: {
          id: Number(context.user.id)
        }
      })
      if (!user) {
        throw new AuthenticationError('Invalid Token')
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

}
