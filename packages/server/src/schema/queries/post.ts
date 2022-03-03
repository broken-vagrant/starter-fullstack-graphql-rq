import { arg, intArg, nonNull, stringArg } from "nexus";
import { ObjectDefinitionBlock } from "nexus/dist/core";
import { Context } from "../../context";

export default function postQueryDef(t: ObjectDefinitionBlock<'Query'>) {

  t.nullable.field('postById', {
    type: 'Post',
    args: {
      id: intArg(),
    },
    resolve: (_parent, args, context: Context) => {
      return context.prisma.post.findUnique({
        where: { id: args.id || undefined },
      })
    },
  })

  t.nonNull.list.nonNull.field('feed', {
    type: 'Post',
    args: {
      searchString: stringArg(),
      skip: intArg(),
      take: intArg(),
      orderBy: arg({
        type: 'PostOrderByUpdatedAtInput',
      }),
    },
    resolve: (_parent, args, context: Context) => {
      const or = args.searchString
        ? {
          OR: [
            { title: { contains: args.searchString } },
            { content: { contains: args.searchString } },
          ],
        }
        : {}

      return context.prisma.post.findMany({
        where: {
          published: true,
          ...or,
        },
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      })
    },
  })

  t.list.field('draftsByUser', {
    type: 'Post',
    args: {
      userUniqueInput: nonNull(
        arg({
          type: 'UserUniqueInput',
        }),
      ),
    },
    resolve: (_parent, args, context: Context) => {
      return context.prisma.user
        .findUnique({
          where: {
            id: args.userUniqueInput.id || undefined,
            email: args.userUniqueInput.email || undefined,
          },
        })
        .posts({
          where: {
            published: false,
          },
        })
    },
  })

}