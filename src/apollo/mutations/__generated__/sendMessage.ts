/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: sendMessage
// ====================================================

export interface sendMessage_newMessage {
  __typename: "MessageItem";
  name: string | null;
  text: string | null;
  createdAt: string | null;
  avatar: string | null;
  order: number | null;
  uid: string | null;
  _id: string | null;
}

export interface sendMessage {
  newMessage: sendMessage_newMessage | null;
}

export interface sendMessageVariables {
  matchId: string;
  name?: string | null;
  text?: string | null;
  createdAt?: string | null;
  avatar?: string | null;
  order?: number | null;
  uid?: string | null;
  _id?: string | null;
  receiverId?: string | null;
}
