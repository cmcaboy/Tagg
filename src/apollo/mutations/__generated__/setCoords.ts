/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setCoords
// ====================================================

export interface setCoords_editUser {
  __typename: "User";
  id: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface setCoords {
  editUser: setCoords_editUser | null;
}

export interface setCoordsVariables {
  id: string;
  latitude?: number | null;
  longitude?: number | null;
}
