import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { context } from './context'
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";


const server = new ApolloServer({
  schema: schema,
  context: context,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],

})

server.listen().then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `)
})
