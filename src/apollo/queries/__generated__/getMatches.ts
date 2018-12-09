/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMatches
// ====================================================

export interface getMatches_user_matchedDates_list_user {
  __typename: "User";
  id: string | null;
  name: string | null;
  pics: (string | null)[] | null;
}

export interface getMatches_user_matchedDates_list_lastMessage {
  __typename: "MessageItem";
  text: string | null;
  name: string | null;
  createdAt: string | null;
}

export interface getMatches_user_matchedDates_list {
  __typename: "Match";
  id: string | null;
  matchId: string | null;
  datetimeOfDate: string | null;
  user: getMatches_user_matchedDates_list_user | null;
  lastMessage: getMatches_user_matchedDates_list_lastMessage | null;
}

export interface getMatches_user_matchedDates {
  __typename: "MatchList";
  id: string | null;
  list: (getMatches_user_matchedDates_list | null)[] | null;
}

export interface getMatches_user_dateRequests_list {
  __typename: "DateItem";
  id: string | null;
  num_bids: number | null;
  open: boolean | null;
  datetimeOfDate: number | null;
  description: string | null;
}

export interface getMatches_user_dateRequests {
  __typename: "DateList";
  id: string | null;
  cursor: number | null;
  list: (getMatches_user_dateRequests_list | null)[] | null;
}

export interface getMatches_user {
  __typename: "User";
  id: string | null;
  name: string | null;
  profilePic: string | null;
  matchedDates: getMatches_user_matchedDates | null;
  dateRequests: getMatches_user_dateRequests | null;
}

export interface getMatches {
  user: getMatches_user | null;
}

export interface getMatchesVariables {
  id?: string | null;
}
