/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: unFollow
// ====================================================

export interface unFollow_unFollow {
  __typename: "User";
  id: string | null;
  name: string | null;
  isFollowing: boolean | null;
}

export interface unFollow {
  unFollow: unFollow_unFollow | null;
}

export interface unFollowVariables {
  id: string;
  unFollowId: string;
}
