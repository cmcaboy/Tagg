/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: flag
// ====================================================

export interface flag_flag {
  __typename: "User";
  id: string | null;
  viewObjectionable: boolean | null;
}

export interface flag {
  flag: flag_flag | null;
}

export interface flagVariables {
  id: string;
  flaggedId: string;
}
