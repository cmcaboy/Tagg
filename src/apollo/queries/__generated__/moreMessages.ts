/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: moreMessages
// ====================================================

export interface moreMessages_moreMessages_list {
  __typename: "MessageItem";
  name: string | null;
  text: string | null;
  createdAt: string | null;
  avatar: string | null;
  order: number | null;
  uid: string | null;
  _id: string | null;
}

export interface moreMessages_moreMessages {
  __typename: "Message";
  id: string | null;
  cursor: number | null;
  list: (moreMessages_moreMessages_list | null)[];
}

export interface moreMessages {
  moreMessages: moreMessages_moreMessages | null;
}

export interface moreMessagesVariables {
  id: string;
  cursor: string;
}
