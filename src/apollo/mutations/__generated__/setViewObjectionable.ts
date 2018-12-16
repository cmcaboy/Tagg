/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setViewObjectionable
// ====================================================

export interface setViewObjectionable_editUser {
  __typename: "User";
  id: string | null;
  viewObjectionable: boolean | null;
}

export interface setViewObjectionable {
  editUser: setViewObjectionable_editUser | null;
}

export interface setViewObjectionableVariables {
  id: string;
  viewObjectionable?: boolean | null;
}
