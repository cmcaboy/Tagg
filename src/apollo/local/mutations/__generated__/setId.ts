export interface setId_user {
  __typename: 'User';
  id: string | number | null;
}

export interface setId {
  user: setId_user | null;
}

export interface setIdVariables {
  id: string | number | null;
}
