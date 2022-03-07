import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      name
      id
    }
  }
`;
export const WHO_AM_I = gql`
  query WhoAmI {
    whoami {
      id
      name
    }
  }
`

export const LOGOUT = gql`
  query Logout {
    logout {
      ok
    }
  }
`