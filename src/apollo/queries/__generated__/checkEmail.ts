/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: checkEmail
// ====================================================

export interface checkEmail_user {
  __typename: "User";
  id: string | null;
  email: string | null;
}

export interface checkEmail {
  user: checkEmail_user | null;
}

export interface checkEmailVariables {
  id?: string | null;
}
