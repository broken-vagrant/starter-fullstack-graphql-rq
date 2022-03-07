/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserCreateWhereInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: SignUp
// ====================================================

export interface SignUp_signupUser {
  __typename: "UserAuthResponse";
  jwt: string;
  refreshToken: string;
}

export interface SignUp {
  signupUser: SignUp_signupUser;
}

export interface SignUpVariables {
  data: UserCreateWhereInput;
}
