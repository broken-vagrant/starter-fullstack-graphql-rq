# Full stack starter (Graphql)

## Requirements

### app

1. `node>=14` for `vitest`

## Available Scripts

### Init

```sh
# setup husky to run defined `precommit` script
npx husky-init && yarn
npx husky add .husky/pre-commit 'yarn run precommit'

# setup mswjs for browser
cd packages/app
npx msw init public/ --save

# mswjs for node is already coded in `setupTests.ts`
```

### [Server](./packages/server)

```sh
yarn server run generate
yarn server run publish:schema # publish to apollo schema registry: https://studio.apollographql.com/sandbox/explorer
yarn server run dev
yarn server run start
```

> Check [Server](./packages/server) for more info.

### [App](./packages/app)

```sh
yarn run dev # dev
yarn run build
yarn run preview
yarn run test # run with vitest
yarn run coverage # run with vitest

# download the published GraphQL schema from apollo studio (Need to set API_KEY env var,check env.example)
yarn app download:prod:schema
#           or
# download the GraphQL schema from a local development server (eg:http://localhost:4000)
yarn app download:local:schema

# Generate static types for GraphQL queries. Can use the
# published schema in the Apollo registry
yarn app apollo:prod:codegen
#  or a
# downloaded schema
yarn app apollo:local:codegen

```

## Future

1. Add e2e tests
2. Add user auth

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
