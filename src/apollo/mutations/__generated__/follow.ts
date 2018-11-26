/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: follow
// ====================================================

export interface follow_follow {
  __typename: "User";
  id: string | null;
  isFollowing: boolean | null;
}

export interface follow {
  follow: follow_follow | null;
}

export interface followVariables {
  id: string;
  followId: string;
  isFollowing?: boolean | null;
}
