/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getDates
// ====================================================

export interface getDates_user_dateRequests_list {
  __typename: "DateItem";
  id: string | null;
  creationTime: number | null;
  datetimeOfDate: number | null;
  description: string | null;
  num_bids: number | null;
  open: boolean | null;
}

export interface getDates_user_dateRequests {
  __typename: "DateList";
  id: string | null;
  list: (getDates_user_dateRequests_list | null)[] | null;
}

export interface getDates_user {
  __typename: "User";
  id: string | null;
  dateRequests: getDates_user_dateRequests | null;
}

export interface getDates {
  user: getDates_user | null;
}

export interface getDatesVariables {
  id?: string | null;
}
