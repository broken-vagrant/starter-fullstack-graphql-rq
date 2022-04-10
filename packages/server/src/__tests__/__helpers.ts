import { ServerInfo } from 'apollo-server';
import getPort, { makeRange } from 'get-port';
import { GraphQLClient } from 'graphql-request';
import faker from '@faker-js/faker';
import { NexusGenInputs } from '@/__generated__/nexus';
import server from '../server';

type TestContext = {
  client: GraphQLClient;
};

export function createTestContext(): TestContext {
  const ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();
  beforeAll(async () => {
    const client = await graphqlCtx.startServerAndGetClient();
    Object.assign(ctx, {
      client,
    });
  });
  afterAll(async () => {
    await graphqlCtx.closeServer();
  });
  return ctx;
}

function graphqlTestContext() {
  let serverInstance: ServerInfo | null = null;
  return {
    async startServerAndGetClient() {
      const port = await getPort({ port: makeRange(4000, 6000) });
      serverInstance = await server.listen({ port });
      return new GraphQLClient(`http://localhost:${port}`);
    },
    async closeServer() {
      serverInstance?.server.unref();
      serverInstance?.server.close();
    },
  };
}
export const createFakeUser = (): NexusGenInputs['UserCreateWhereInput'] => ({
  email: faker.internet.email(faker.random.word()),
  password: faker.internet.password(8),
  name: faker.name.firstName(),
});

export const createFakePostData = (): NexusGenInputs['PostCreateInput'] => ({
  title: faker.lorem.words(5),
  content: faker.lorem.paragraphs(2),
});
