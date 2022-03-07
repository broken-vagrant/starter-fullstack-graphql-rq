import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!,$password: String!) {
    login(data: {
      email: $email,
      password: $password
    }) {
    jwt
    refreshToken
    }
  }
`

export const SIGNUP = gql`
mutation SignUp($data: UserCreateWhereInput!) {
  signupUser(data: $data) {
    jwt
    refreshToken
  }
}
`;