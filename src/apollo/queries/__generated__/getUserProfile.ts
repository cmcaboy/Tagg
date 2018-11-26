/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserProfile
// ====================================================

export interface getUserProfile_user {
  __typename: "User";
  id: string | null;
  name: string | null;
  work: string | null;
  school: string | null;
  pics: (string | null)[] | null;
  description: string | null;
  isFollowing: boolean | null;
  hasDateOpen: boolean | null;
  distanceApart: number | null;
}

export interface getUserProfile {
  user: getUserProfile_user | null;
}

export interface getUserProfileVariables {
  id?: string | null;
  hostId?: string | null;
}
