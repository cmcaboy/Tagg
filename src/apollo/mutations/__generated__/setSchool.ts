/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setSchool
// ====================================================

export interface setSchool_editUser {
  __typename: "User";
  id: string | null;
  school: string | null;
}

export interface setSchool {
  editUser: setSchool_editUser | null;
}

export interface setSchoolVariables {
  id: string;
  school?: string | null;
}
