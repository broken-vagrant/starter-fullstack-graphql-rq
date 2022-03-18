# React starter with mock test setup

## requirements

`node>=14` for `vitest`

## Usage

```sh
yarn run dev
yarn run build
yarn run preview
yarn run test # run with vitest
yarn run coverage # run with vitest

# download the published GraphQL schema from apollo studio (Need to login with `rover cli`)
# follow docs: https://www.apollographql.com/docs/rover/configuring/#2-provide-the-api-key-to-rover
npx rover config auth
npx rover graph fetch [your_graph_id]@[variant] > src/__generated__/schema.graphql

# download the GraphQL schema from a local development server (eg:http://localhost:4000)
yarn download:schema:local

# Generate static types for GraphQL queries. Use the downloaded schema
yarn gql:codegen

# setup mswjs for browser
yarn msw:init
```
