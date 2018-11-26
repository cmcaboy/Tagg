/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: otherBids
// ====================================================

export interface otherBids_otherBids_list_bidUser {
  __typename: "User";
  id: string | null;
  name: string | null;
  profilePic: string | null;
}

export interface otherBids_otherBids_list {
  __typename: "DateBid";
  id: string | null;
  datetimeOfBid: string | null;
  bidDescription: string | null;
  bidPlace: string | null;
  bidUser: otherBids_otherBids_list_bidUser | null;
}

export interface otherBids_otherBids {
  __typename: "DateBidList";
  id: string | null;
  cursor: number | null;
  list: (otherBids_otherBids_list | null)[] | null;
}

export interface otherBids {
  otherBids: otherBids_otherBids | null;
}

export interface otherBidsVariables {
  id: string;
}
