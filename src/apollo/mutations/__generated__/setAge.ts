/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setAge
// ====================================================

export interface setAge_editUser {
  __typename: "User";
  id: string | null;
  age: number | null;
}

export interface setAge {
  editUser: setAge_editUser | null;
}

export interface setAgeVariables {
  id: string;
  age?: number | null;
}
