/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setDescription
// ====================================================

export interface setDescription_editUser {
  __typename: "User";
  id: string | null;
  description: string | null;
}

export interface setDescription {
  editUser: setDescription_editUser | null;
}

export interface setDescriptionVariables {
  id: string;
  description?: string | null;
}
