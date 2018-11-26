/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: getNewMessages
// ====================================================

export interface getNewMessages_newMessageSub {
  __typename: "MessageItem";
  name: string | null;
  text: string | null;
  createdAt: string | null;
  avatar: string | null;
  order: number | null;
  uid: string | null;
  _id: string | null;
}

export interface getNewMessages {
  newMessageSub: getNewMessages_newMessageSub | null;
}

export interface getNewMessagesVariables {
  matchId?: string | null;
  id?: string | null;
}
