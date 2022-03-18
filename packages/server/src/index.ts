import 'dotenv/config';
import server from './server';

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(async ({ url }) => {
    console.log(`\
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/ts/graphql#using-the-graphql-api
  `);
  });
