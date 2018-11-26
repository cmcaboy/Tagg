/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMessages
// ====================================================

export interface getMessages_messages_list {
  __typename: "MessageItem";
  _id: string | null;
  name: string | null;
  text: string | null;
  createdAt: string | null;
  avatar: string | null;
  order: number | null;
  uid: string | null;
}

export interface getMessages_messages {
  __typename: "Message";
  id: string | null;
  cursor: number | null;
  list: (getMessages_messages_list | null)[];
}

export interface getMessages {
  messages: getMessages_messages | null;
}

export interface getMessagesVariables {
  id: string;
}
