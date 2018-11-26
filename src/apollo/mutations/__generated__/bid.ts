/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: bid
// ====================================================

export interface bid_bid_date {
  __typename: "DateItem";
  id: string | null;
  num_bids: number | null;
}

export interface bid_bid {
  __typename: "DateBid";
  id: string | null;
  datetimeOfBid: string | null;
  bidDescription: string | null;
  bidPlace: string | null;
  date: bid_bid_date | null;
}

export interface bid {
  bid: bid_bid | null;
}

export interface bidVariables {
  id: string;
  dateId: string;
  bidPlace?: string | null;
  bidDescription?: string | null;
}
