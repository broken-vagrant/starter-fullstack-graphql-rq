import {
  arg,
  extendType,
  inputObjectType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { Context } from '@/context';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('title');
    t.string('content');
    t.nonNull.boolean('published');
    t.nonNull.int('viewCount');
    t.field('author', {
      type: 'BaseUser',
      resolve: (parent, _, context: Context) => {
        return context.prisma.post
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author({
            select: {
              id: true,
              name: true,
              email: true,
            },
          });
      },
    });
  },
});

export const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  definition(t) {
    t.nonNull.string('title');
    t.string('content');
  },
});

export const PostOrderByUpdatedAtInput = inputObjectType({
  name: 'PostOrderByUpdatedAtInput',
  definition(t) {
    t.nonNull.field('updatedAt', { type: 'SortOrder' });
  },
});

export const postQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.nullable.field('postById', {
      type: 'Post',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context: Context) => {
        return context.prisma.post.findUnique({
          where: { id: args.id || undefined },
        });
      },
    });

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
          : {};

        return context.prisma.post.findMany({
          where: {
            published: true,
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy || undefined,
        });
      },
    });

    t.list.field('draftsByUser', {
      type: 'Post',
      args: {
        userUniqueInput: nonNull(
          arg({
            type: 'UserUniqueInput',
          })
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
          });
      },
    });
  },
});

export const postMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createDraft', {
      type: 'Post',
      args: {
        data: nonNull(
          arg({
            type: 'PostCreateInput',
          })
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
        });
      },
    });

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
          });
          return context.prisma.post.update({
            where: { id: args.id || undefined },
            data: { published: !post?.published },
          });
        } catch (e) {
          throw new Error(
            `Post with ID ${args.id} does not exist in the database.`
          );
        }
      },
    });

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
        });
      },
    });

    t.field('deletePost', {
      type: 'Post',
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, args, context: Context) => {
        return context.prisma.post.delete({
          where: { id: args.id },
        });
      },
    });
  },
});
