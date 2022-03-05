import { ApolloServer } from 'apollo-server'
import schema from './schema'
import { Context, context } from './context'
import {
  ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginUsageReportingDisabled
} from "apollo-server-core";
import { isProd } from './constants'
import { getUser } from './utils';

const server = new ApolloServer({
  schema: schema,
  context: ({ req }) => {
    const token = req.headers['authorization'] || '';
    const user = getUser(token) as Context['user'];
    context.user = user;
    return context;
  },
  plugins: [
    isProd ?
      ApolloServerPluginLandingPageProductionDefault() : ApolloServerPluginLandingPageGraphQLPlayground(),
    !isProd ? ApolloServerPluginUsageReportingDisabled() : {}
  ],
})
export default server;

