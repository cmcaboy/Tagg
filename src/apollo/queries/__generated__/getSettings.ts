/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSettings
// ====================================================

export interface getSettings_user {
  __typename: "User";
  id: string | null;
  minAgePreference: number | null;
  maxAgePreference: number | null;
  distance: number | null;
  sendNotifications: boolean | null;
  followerDisplay: string | null;
  viewObjectionable: boolean | null;
}

export interface getSettings {
  user: getSettings_user | null;
}

export interface getSettingsVariables {
  id?: string | null;
}
