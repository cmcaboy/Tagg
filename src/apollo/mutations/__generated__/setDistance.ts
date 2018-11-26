/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setDistance
// ====================================================

export interface setDistance_editUser {
  __typename: "User";
  id: string | null;
  distance: number | null;
}

export interface setDistance {
  editUser: setDistance_editUser | null;
}

export interface setDistanceVariables {
  id: string;
  distance?: number | null;
}
