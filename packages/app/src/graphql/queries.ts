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
export const LOGIN = gql`
  query Login($email: String!,$password: String!) {
    login(data: {
      email: $email,
      password: $password
    }) {
    jwt
    refreshToken
    }
  }
`
export const REFRESH_JWT_TOKEN = gql`
  query RefreshJwtToken($data: RefreshTokenInput!) { refreshToken(data: $data) {
      jwt
    }
  }
`