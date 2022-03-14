declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APOLLO_KEY: string;
      APOLLO_GRAPH_REF: string;
      APOLLO_SCHEMA_REPORTING: string;
      JWT_SECRET: string;
      FRONTEND_URL: string;
      JWT_TOKEN_EXPIRES_IN: string;
      JWT_REFRESH_TOKEN_EXPIRES_IN: string;
      DATABASE_URL: string;
      SHADOW_DATABASE_URL: string;
    }
  }
}

export {};
