import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import schema from './schema';
import { Context, context } from './context';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginUsageReportingDisabled,
} from 'apollo-server-core';
import { IS_PROD } from './constants';
import { getUser } from './utils';

const server = new ApolloServer({
  schema: schema,
  context: ({ req, res }) => {
    const rawToken = req.headers['authorization'] || '';
    const token = rawToken.split(' ')[1];
    const user = getUser(token) as Context['user'];

    context.user = user;
    context.req = req;
    context.res = res;
    return context;
  },
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  plugins: [
    IS_PROD
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
    !IS_PROD ? ApolloServerPluginUsageReportingDisabled() : {},
  ],
});
export default server;
