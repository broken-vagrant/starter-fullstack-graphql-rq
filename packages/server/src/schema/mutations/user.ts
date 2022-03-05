import { arg, nonNull, ObjectDefinitionBlock } from "nexus/dist/core"
import { Context } from "../../context"
import bcrypt from 'bcrypt';

export default function userMutationDef(t: ObjectDefinitionBlock<'Mutation'>) {
  t.nonNull.field('signupUser', {
    type: 'User',
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
      const { email, name, password } = args.data;
      const user = await context.prisma.user.findFirst({
        where: {
          email
        }
      })
      if (user) {
        throw new Error(`user with email: ${email} already Exists`);
      }
      const passwordHash = await bcrypt.hash(password, 10);
      return context.prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          posts: {
            create: postData,
          },
        },
      })
    },
  })
}