declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APOLLO_KEY: string;
      APOLLO_GRAPH_REF: string;
      APOLLO_SCHEMA_REPORTING: string;
      JWT_SECRET_OR_PRIVATE_KEY: string;
      JWT_SECRET_OR_PUBLIC_KEY: string;
      FRONTEND_URL: string;
    }
  }
}

export {}
