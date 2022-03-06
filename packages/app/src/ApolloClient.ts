import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";

const link = new HttpLink({
  uri: "http://localhost:4000/graphql",

  // Use explicit `window.fetch` so tha outgoing requests
  // are captured and deferred until the Service Worker is ready.
  fetch: (...args) => fetch(...args),
});

const cache = new InMemoryCache({
  addTypename: false,
});

export const client = new ApolloClient({
  cache,
  link,
});
