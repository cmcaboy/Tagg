/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getQueue
// ====================================================

export interface getQueue_user_queue_list {
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

export interface getQueue_user_queue {
  __typename: "Queue";
  id: string | null;
  cursor: number | null;
  list: (getQueue_user_queue_list | null)[] | null;
}

export interface getQueue_user {
  __typename: "User";
  id: string | null;
  token: string | null;
  followerDisplay: string | null;
  queue: getQueue_user_queue | null;
}

export interface getQueue {
  user: getQueue_user | null;
}
