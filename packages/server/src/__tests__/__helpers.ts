import { ServerInfo } from "apollo-server";
import getPort, { makeRange } from "get-port";
import { GraphQLClient } from "graphql-request";
import server from "../server";

type TestContext = {
  client: GraphQLClient;
};

export function createTestContext(): TestContext {
  const ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();
  beforeEach(async () => {
    const client = await graphqlCtx.startServerAndGetClient();
    Object.assign(ctx, {
      client,
    });
  });
  afterEach(async () => {
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
