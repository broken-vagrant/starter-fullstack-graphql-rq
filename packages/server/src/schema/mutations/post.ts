import { arg, intArg, nonNull, ObjectDefinitionBlock, stringArg } from "nexus/dist/core"
import { Context } from "@/context"

export default function postMutationDef(t: ObjectDefinitionBlock<'Mutation'>) {
  t.field('createDraft', {
    type: 'Post',
    args: {
      data: nonNull(
        arg({
          type: 'PostCreateInput',
        }),
      ),
      authorEmail: nonNull(stringArg()),
    },
    resolve: (_, args, context: Context) => {
      return context.prisma.post.create({
        data: {
          title: args.data.title,
          content: args.data.content,
          author: {
            connect: { email: args.authorEmail },
          },
        },
      })
    },
  })

  t.field('togglePublishPost', {
    type: 'Post',
    args: {
      id: nonNull(intArg()),
    },
    resolve: async (_, args, context: Context) => {
      try {
        const post = await context.prisma.post.findUnique({
          where: { id: args.id || undefined },
          select: {
            published: true,
          },
        })
        return context.prisma.post.update({
          where: { id: args.id || undefined },
          data: { published: !post?.published },
        })
      } catch (e) {
        throw new Error(
          `Post with ID ${args.id} does not exist in the database.`,
        )
      }
    },
  })

  t.field('incrementPostViewCount', {
    type: 'Post',
    args: {
      id: nonNull(intArg()),
    },
    resolve: (_, args, context: Context) => {
      return context.prisma.post.update({
        where: { id: args.id || undefined },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      })
    },
  })

  t.field('deletePost', {
    type: 'Post',
    args: {
      id: nonNull(intArg()),
    },
    resolve: (_, args, context: Context) => {
      return context.prisma.post.delete({
        where: { id: args.id },
      })
    },
  })
}