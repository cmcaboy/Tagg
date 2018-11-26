/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEditProfile
// ====================================================

export interface getEditProfile_user {
  __typename: 'User';
  id: string | null;
  pics: (string | null)[] | null;
  name: string | null;
  age: number | null;
  school: string | null;
  work: string | null;
  description: string | null;
  email: string | null;
}

export interface getEditProfile {
  user: getEditProfile_user | null;
}

export interface getEditProfileVariables {
  id?: string | null;
}
