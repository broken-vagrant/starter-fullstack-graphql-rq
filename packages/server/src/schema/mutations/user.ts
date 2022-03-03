import { arg, nonNull, ObjectDefinitionBlock } from "nexus/dist/core"
import { Context } from "../../context"

export default function userMutationDef(t: ObjectDefinitionBlock<'Mutation'>) {
  t.nonNull.field('signupUser', {
    type: 'User',
    args: {
      data: nonNull(
        arg({
          type: 'UserCreateInput',
        }),
      ),
    },
    resolve: (_, args, context: Context) => {
      const postData = args.data.posts?.map((post) => {
        return { title: post.title, content: post.content || undefined }
      })
      return context.prisma.user.create({
        data: {
          name: args.data.name,
          email: args.data.email,
          posts: {
            create: postData,
          },
        },
      })
    },
  })
}