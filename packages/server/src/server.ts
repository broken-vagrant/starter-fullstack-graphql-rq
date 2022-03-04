import { ApolloServer } from 'apollo-server'
import schema from './schema'
import { context } from './context'
import {
  ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginUsageReportingDisabled
} from "apollo-server-core";
import { isProd } from './constants'

const server = new ApolloServer({
  schema: schema,
  context: context,
  plugins: [
    isProd ?
      ApolloServerPluginLandingPageProductionDefault() : ApolloServerPluginLandingPageGraphQLPlayground(),
    !isProd ? ApolloServerPluginUsageReportingDisabled() : {}
  ],
})
export default server;

