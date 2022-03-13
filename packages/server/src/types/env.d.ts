declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APOLLO_KEY: string;
      APOLLO_GRAPH_REF: string;
      APOLLO_SCHEMA_REPORTING: string;
      JWT_SECRET_OR_PRIVATE_KEY: string;
      JWT_SECRET_OR_PUBLIC_KEY: string;
      FRONTEND_URL: string;
      JWT_TOKEN_EXPIRES_IN: string;
      JWT_REFRESH_TOKEN_EXPIRES_IN: string;
      DATABASE_URL: string;
      SHADOW_DATABASE_URL: string;
    }
  }
}

export {}
