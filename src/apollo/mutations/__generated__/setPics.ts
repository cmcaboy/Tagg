/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setPics
// ====================================================

export interface setPics_editUser {
  __typename: "User";
  id: string | null;
  pics: (string | null)[] | null;
}

export interface setPics {
  editUser: setPics_editUser | null;
}

export interface setPicsVariables {
  id: string;
  pics?: (string | null)[] | null;
}
