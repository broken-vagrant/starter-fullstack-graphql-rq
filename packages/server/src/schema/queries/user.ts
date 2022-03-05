import { arg, nonNull, ObjectDefinitionBlock } from "nexus/dist/core";
import { Context } from "../../context";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from "../../constants";

export default function userQueryDef(t: ObjectDefinitionBlock<'Query'>) {

  t.field('whoami', {
    type: 'User',
    resolve: async (_, _args, context) => {
      if (!context.user) {
        throw new Error('Invalid Token');
      }
      const user = await context.prisma.user.findUnique({
        where: {
          id: context.user.id
        }
      })
      if (!user) {
        throw new Error('Invalid Token')
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

  t.field('login', {
    type: 'UserLoginResponse',
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
        throw new Error(`user with email: ${email} doesn't Exist`);
      }
      const match = await bcrypt.compare(password, user.passwordHash);

      if (!match) {
        throw new Error(`Invalid credentials`);
      }
      const token = jwt.sign({ id: user.id }, getJwtSecret(), { expiresIn: '1h' });
      return {
        user,
        token
      };
    }
  })

}