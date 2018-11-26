/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setAgePreference
// ====================================================

export interface setAgePreference_editUser {
  __typename: "User";
  id: string | null;
  minAgePreference: number | null;
  maxAgePreference: number | null;
}

export interface setAgePreference {
  editUser: setAgePreference_editUser | null;
}

export interface setAgePreferenceVariables {
  id: string;
  minAgePreference?: number | null;
  maxAgePreference?: number | null;
}
