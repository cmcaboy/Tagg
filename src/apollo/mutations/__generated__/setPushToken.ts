/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setPushToken
// ====================================================

export interface setPushToken_editUser {
  __typename: "User";
  id: string | null;
  token: string | null;
}

export interface setPushToken {
  editUser: setPushToken_editUser | null;
}

export interface setPushTokenVariables {
  id: string;
  token?: string | null;
}
