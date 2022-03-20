# React starter with mock test setup

## requirements

`node>=14` for `vitest`

## Usage

```sh
# download the published GraphQL schema from apollo studio (Need to login with `rover cli`)
# follow docs: https://www.apollographql.com/docs/rover/configuring/#2-provide-the-api-key-to-rover
npx rover config auth
npx rover graph fetch [your_graph_id]@[variant] > src/__generated__/schema.graphql

# download the GraphQL schema from a local development server (eg:http://localhost:4000)
yarn download:schema:local

# Generate static types for GraphQL queries. Use the downloaded schema
yarn gql:codegen

yarn dev
yarn test
yarn coverage
yarn preview
yarn build

# setup mswjs for browser
yarn msw:init
```
