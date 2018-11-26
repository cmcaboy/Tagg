/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setFollowerDisplay
// ====================================================

export interface setFollowerDisplay_editUser {
  __typename: "User";
  id: string | null;
  followerDisplay: string | null;
}

export interface setFollowerDisplay {
  editUser: setFollowerDisplay_editUser | null;
}

export interface setFollowerDisplayVariables {
  id: string;
  followerDisplay?: string | null;
}
