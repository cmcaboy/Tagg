/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProfile
// ====================================================

export interface getProfile_user {
  __typename: "User";
  id: string | null;
  name: string | null;
  work: string | null;
  school: string | null;
  pics: (string | null)[] | null;
}

export interface getProfile {
  user: getProfile_user | null;
}

export interface getProfileVariables {
  id?: string | null;
}
