# Typescript Full stack starter (Graphql)

## Requirements

### app

1. `node>=14` for `vitest`

### server

1. `node>=15` for `crypto.webcrypto`

## Available Scripts

### Init

```sh

# setup husky to run defined `precommit` script
npx husky-init && yarn
npx husky add .husky/pre-commit 'yarn run precommit'

# setup MSW (app)
yarn app msw:init
```

### [Server](./packages/server)

```sh

#----- DB (managed by Prisma) ----- #
# apply/create intial db migration
yarn server prisma:migrate:init
# apply latest prisma schema to db
yarn server prisma:db:push
# reset the database && undo manual changes or db push experiments
yarn server prisma:migrate:reset
# made changes to schema,run migrate
yarn server prisma:migrate:dev
# deploy migrations (in productsion)
yarn server prisma:migrate:deploy

# Generate artifacts (Prisma Client & Nexus Types)
yarn server run generate

# Publish schema to Apollo schema registry (Needs Development server running)
# source: https://studio.apollographql.com/sandbox/explorer
yarn server run publish:schema

yarn server dev
yarn server test
yarn server start

# Misc
yarn server prettier
yarn server lint
# Generate env types(src/types/env.d.ts) from .env file
yarn server gen:env-types
```

> Check [Server](./packages/server) for more info.

### [App](./packages/app)

```sh

# download the published GraphQL schema from apollo studio (Need to login with `rover`)
# follow docs: https://www.apollographql.com/docs/rover/configuring/#2-provide-the-api-key-to-rover
npx rover config auth
npx rover graph fetch [your_graph_id]@[variant] > fetched_schema.graphql

# download the GraphQL schema from a local development server (eg:http://localhost:4000)
yarn app download:schema:local

# Generate static types for GraphQL queries. Use the downloaded schema
yarn app gql:codegen


# setup mswjs for browser
yarn app msw:init

yarn run dev
yarn run build
yarn run preview
yarn run test # run with vitest
yarn run coverage # run with vitest

```

## Future

1. Add e2e tests
2. improve token synchronization between tabs

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
