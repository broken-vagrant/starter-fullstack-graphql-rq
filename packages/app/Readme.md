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

# download the published GraphQL schema from apollo studio (Need to set API_KEY env var,check env.example)
yarn app download:prod:schema
#           or
# download the GraphQL schema from a local development server (eg:http://localhost:4000)
yarn app download:local:schema

# Generate static types for GraphQL queries. Use the
# published schema from Apollo registry
yarn app apollo:prod:codegen

# Generate static types for GraphQL queries. Use the downloaded schema
yarn app apollo:local:codegen

# setup mswjs for browser
yarn app msw:init
```
