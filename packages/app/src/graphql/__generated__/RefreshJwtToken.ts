/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RefreshTokenInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: RefreshJwtToken
// ====================================================

export interface RefreshJwtToken_refreshToken {
  __typename: "RefreshTokenResponse";
  jwt: string;
}

export interface RefreshJwtToken {
  refreshToken: RefreshJwtToken_refreshToken | null;
}

export interface RefreshJwtTokenVariables {
  data: RefreshTokenInput;
}
