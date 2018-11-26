/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: newUser
// ====================================================

export interface newUser_newUser {
  __typename: "User";
  id: string | null;
  name: string | null;
  email: string | null;
}

export interface newUser {
  newUser: newUser_newUser | null;
}

export interface newUserVariables {
  id: string;
  name: string;
  active?: boolean | null;
  email: string;
  gender?: string | null;
  description?: string | null;
  school?: string | null;
  work?: string | null;
  sendNotifications?: boolean | null;
  distance?: number | null;
  token?: string | null;
  minAgePreference?: number | null;
  maxAgePreference?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  followerDisplay?: string | null;
  pics?: (string | null)[] | null;
}
