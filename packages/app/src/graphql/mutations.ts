import { gql } from "@apollo/client";

export const SIGNUP = gql`
mutation SignUp($data: UserCreateWhereInput!) {
  signupUser(data: $data) {
    jwt
    refreshToken
  }
}
`;