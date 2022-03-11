import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
import { fetcher } from '@/lib/fetch';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type BaseUser = {
  __typename?: 'BaseUser';
  email: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  ok: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createDraft?: Maybe<Post>;
  deletePost?: Maybe<Post>;
  incrementPostViewCount?: Maybe<Post>;
  login?: Maybe<UserAuthResponse>;
  logout: LogoutResponse;
  refreshToken?: Maybe<RefreshTokenResponse>;
  signupUser: UserAuthResponse;
  togglePublishPost?: Maybe<Post>;
};


export type MutationCreateDraftArgs = {
  authorEmail: Scalars['String'];
  data: PostCreateInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationIncrementPostViewCountArgs = {
  id: Scalars['Int'];
};


export type MutationLoginArgs = {
  data: UserLoginInput;
};


export type MutationRefreshTokenArgs = {
  data: RefreshTokenInput;
};


export type MutationSignupUserArgs = {
  data: UserCreateWhereInput;
};


export type MutationTogglePublishPostArgs = {
  id: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<BaseUser>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  published: Scalars['Boolean'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  viewCount: Scalars['Int'];
};

export type PostCreateInput = {
  content?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type PostOrderByUpdatedAtInput = {
  updatedAt: SortOrder;
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<BaseUser>;
  draftsByUser?: Maybe<Array<Maybe<Post>>>;
  feed: Array<Post>;
  postById?: Maybe<Post>;
  whoami?: Maybe<BaseUser>;
};


export type QueryDraftsByUserArgs = {
  userUniqueInput: UserUniqueInput;
};


export type QueryFeedArgs = {
  orderBy?: InputMaybe<PostOrderByUpdatedAtInput>;
  searchString?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryPostByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type RefreshTokenInput = {
  fingerPrintHash: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  jwt: Scalars['String'];
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  passwordHash: Scalars['String'];
  posts: Array<Maybe<Post>>;
  refreshToken?: Maybe<Scalars['String']>;
  refreshTokenExpiresAt?: Maybe<Scalars['DateTime']>;
};

export type UserAuthResponse = {
  __typename?: 'UserAuthResponse';
  jwt: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type UserCreateWhereInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type UserLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserUniqueInput = {
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};

export type SignUpMutationVariables = Exact<{
  data: UserCreateWhereInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signupUser: { __typename?: 'UserAuthResponse', jwt: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', ok: boolean } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'UserAuthResponse', jwt: string, refreshToken: string } | null };

export type RefreshJwtTokenMutationVariables = Exact<{
  data: RefreshTokenInput;
}>;


export type RefreshJwtTokenMutation = { __typename?: 'Mutation', refreshToken?: { __typename?: 'RefreshTokenResponse', jwt: string } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'BaseUser', name: string, id: number }> };

export type WhoAmIQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoAmIQuery = { __typename?: 'Query', whoami?: { __typename?: 'BaseUser', id: number, name: string } | null };


export const SignUpDocument = `
    mutation SignUp($data: UserCreateWhereInput!) {
  signupUser(data: $data) {
    jwt
    refreshToken
  }
}
    `;
export const useSignUpMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SignUpMutation, TError, SignUpMutationVariables, TContext>) =>
    useMutation<SignUpMutation, TError, SignUpMutationVariables, TContext>(
      ['SignUp'],
      (variables?: SignUpMutationVariables) => fetcher<SignUpMutation, SignUpMutationVariables>(SignUpDocument, variables)(),
      options
    );
export const LogoutDocument = `
    mutation Logout {
  logout {
    ok
  }
}
    `;
export const useLogoutMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>) =>
    useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
      ['Logout'],
      (variables?: LogoutMutationVariables) => fetcher<LogoutMutation, LogoutMutationVariables>(LogoutDocument, variables)(),
      options
    );
export const LoginDocument = `
    mutation Login($email: String!, $password: String!) {
  login(data: {email: $email, password: $password}) {
    jwt
    refreshToken
  }
}
    `;
export const useLoginMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>) =>
    useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
      ['Login'],
      (variables?: LoginMutationVariables) => fetcher<LoginMutation, LoginMutationVariables>(LoginDocument, variables)(),
      options
    );
export const RefreshJwtTokenDocument = `
    mutation RefreshJwtToken($data: RefreshTokenInput!) {
  refreshToken(data: $data) {
    jwt
  }
}
    `;
export const useRefreshJwtTokenMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RefreshJwtTokenMutation, TError, RefreshJwtTokenMutationVariables, TContext>) =>
    useMutation<RefreshJwtTokenMutation, TError, RefreshJwtTokenMutationVariables, TContext>(
      ['RefreshJwtToken'],
      (variables?: RefreshJwtTokenMutationVariables) => fetcher<RefreshJwtTokenMutation, RefreshJwtTokenMutationVariables>(RefreshJwtTokenDocument, variables)(),
      options
    );
export const GetAllUsersDocument = `
    query GetAllUsers {
  allUsers {
    name
    id
  }
}
    `;
export const useGetAllUsersQuery = <
      TData = GetAllUsersQuery,
      TError = unknown
    >(
      variables?: GetAllUsersQueryVariables,
      options?: UseQueryOptions<GetAllUsersQuery, TError, TData>
    ) =>
    useQuery<GetAllUsersQuery, TError, TData>(
      variables === undefined ? ['GetAllUsers'] : ['GetAllUsers', variables],
      fetcher<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, variables),
      options
    );
export const WhoAmIDocument = `
    query WhoAmI {
  whoami {
    id
    name
  }
}
    `;
export const useWhoAmIQuery = <
      TData = WhoAmIQuery,
      TError = unknown
    >(
      variables?: WhoAmIQueryVariables,
      options?: UseQueryOptions<WhoAmIQuery, TError, TData>
    ) =>
    useQuery<WhoAmIQuery, TError, TData>(
      variables === undefined ? ['WhoAmI'] : ['WhoAmI', variables],
      fetcher<WhoAmIQuery, WhoAmIQueryVariables>(WhoAmIDocument, variables),
      options
    );