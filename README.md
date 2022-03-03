## Requirements

### app

1. Vitest requires Vite >=v2.7.10 and Node >=v14

## Available Scripts

### Init

```sh
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
yarn server run dev
yarn server run start
```

### [App](./packages/app)

```sh
yarn app run preview
yarn app run test
yarn app run dev
```

### Possible Errors

1. `Cannot find module '/[redacted]/starter/.yarn/releases/yarn-berry.cjs`

```sh
rm .yarnrc.yml
yarn set version berry

# and add below line to `.yarnrc.yml`
nodeLinker: node-modules

```
