import { makeSchema } from 'nexus';
import * as allTypes from './types';

export default makeSchema({
  types: allTypes,
  outputs: {
    schema: __dirname + '/../__generated__/schema.graphql',
    typegen: __dirname + '/../__generated__/nexus.ts',
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
});
