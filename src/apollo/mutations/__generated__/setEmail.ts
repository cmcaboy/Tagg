/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setEmail
// ====================================================

export interface setEmail_editUser {
  __typename: "User";
  id: string | null;
  email: string | null;
}

export interface setEmail {
  editUser: setEmail_editUser | null;
}

export interface setEmailVariables {
  id: string;
  email?: string | null;
}
