import { ObjectDefinitionBlock } from "nexus/dist/core";
import { Context } from "../../context";

export default function userQueryDef(t: ObjectDefinitionBlock<'Query'>) {

  t.nonNull.list.nonNull.field('allUsers', {
    type: 'User',
    resolve: (_parent, _args, context: Context) => {
      return context.prisma.user.findMany()
    },
  })

}