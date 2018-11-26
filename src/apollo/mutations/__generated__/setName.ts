/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setName
// ====================================================

export interface setName_editUser {
  __typename: "User";
  id: string | null;
  name: string | null;
}

export interface setName {
  editUser: setName_editUser | null;
}

export interface setNameVariables {
  id: string;
  name?: string | null;
}
