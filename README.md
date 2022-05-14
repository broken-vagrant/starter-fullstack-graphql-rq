> I **moved** this repo to poly repo structure, here are links([frontend](https://github.com/zkindest/fs-gql-rq-frontend),[backend](https://github.com/zkindest/fs-gql-rq-backend)).
> 
> **NOTE:** This Mono repo **isn't being updated** anymore because I don't want to use build systems like Nx,Bazel. checkout this [website](https://monorepo.tools/) on why these tools are required.

# Typescript Full stack starter (Graphql)
It includes user authentication flow based on JWT, refreshTokens, tab synchronization using broadcast channel. It uses React, Graphql, Apollo server, Express, Nexus, React-query, jest, vite, vitest (improved testing for vite).
## Requirements

### app

1. `node>=14` for `vitest`

## Recomended

1. [mysql vscode extension](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2&ssr=false#review-details)

## Available Scripts

### Init

```sh
# setup MSW (app)
yarn app msw:init
```

### [Server](./packages/server)

```sh
# Generate artifacts (Prisma Client & Nexus Types)
yarn server run generate

# Generate env types(src/types/env.d.ts) from .env file
yarn server gen:env-types

yarn server dev
yarn server test
yarn server start

# Publish schema to Apollo schema registry (Needs Development server running)
# change `starter-fullstack@current` with your `graph-id@variant` in `package.json`
# more info: https://studio.apollographql.com/sandbox/explorer
yarn server run publish:schema
```

> Check [Server](./packages/server) for more info.

### [App](./packages/app)

```sh

# download the published GraphQL schema from apollo studio (Need to setup rover auth)
# follow docs: https://www.apollographql.com/docs/rover/configuring/#2-provide-the-api-key-to-rover
npx rover config auth
npx rover graph fetch [your_graph_id]@[variant] > src/__generated__/schema.graphql

# download the GraphQL schema from a local development server (eg:http://localhost:4000)
yarn app download:schema:local

# Generate static types for GraphQL queries. Use the downloaded schema
yarn app gql:codegen

yarn app dev
yarn app test
yarn app coverage
yarn app preview
yarn app build

```

## Future

1. Add e2e tests
2. ~~improve token synchronization between tabs~~ ✅️

## Troubleshoot

<details>
<summary>
Cannot find module '/[redacted]/starter/.yarn/releases/yarn-berry.cjs
</summary>

```sh
rm .yarnrc.yml
yarn set version berry

# and add below line to `.yarnrc.yml`
nodeLinker: node-modules

```

</details>
