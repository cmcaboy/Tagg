/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: moreQueue
// ====================================================

export interface moreQueue_moreQueue_list {
  __typename: "User";
  id: string | null;
  name: string | null;
  pics: (string | null)[] | null;
  age: number | null;
  description: string | null;
  work: string | null;
  school: string | null;
  distanceApart: number | null;
  order: number | null;
  profilePic: string | null;
  isFollowing: boolean | null;
  hasDateOpen: boolean | null;
}

export interface moreQueue_moreQueue {
  __typename: "Queue";
  id: string | null;
  cursor: number | null;
  list: (moreQueue_moreQueue_list | null)[] | null;
}

export interface moreQueue {
  moreQueue: moreQueue_moreQueue | null;
}

export interface moreQueueVariables {
  followerDisplay?: string | null;
  cursor: number;
}
