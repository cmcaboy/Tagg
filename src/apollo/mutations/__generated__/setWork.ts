/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setWork
// ====================================================

export interface setWork_editUser {
  __typename: "User";
  id: string | null;
  work: string | null;
}

export interface setWork {
  editUser: setWork_editUser | null;
}

export interface setWorkVariables {
  id: string;
  work?: string | null;
}
