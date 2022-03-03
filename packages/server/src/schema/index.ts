import { makeSchema } from 'nexus';
import entities from './entites';
import Mutation from './mutations';
import Query from './queries';
import types from './types';

export default makeSchema({
  types: {
    ...entities,
    ...types,
    Query,
    Mutation,
  },
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('../context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
