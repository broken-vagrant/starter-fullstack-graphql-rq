# React starter with mock test setup

## requirements

`node>=14` for `vitest`

## Usage

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
