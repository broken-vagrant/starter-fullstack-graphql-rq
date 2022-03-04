import { ApolloServer } from 'apollo-server'
import schema from './schema'
import { context } from './context'
import {
  ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault
} from "apollo-server-core";


const server = new ApolloServer({
  schema: schema,
  context: context,
  plugins: [
    process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageProductionDefault() : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
})

server.listen().then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
