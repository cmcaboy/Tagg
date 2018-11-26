/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setNotifications
// ====================================================

export interface setNotifications_editUser {
  __typename: "User";
  id: string | null;
  sendNotifications: boolean | null;
}

export interface setNotifications {
  editUser: setNotifications_editUser | null;
}

export interface setNotificationsVariables {
  id: string;
  sendNotifications?: boolean | null;
}
