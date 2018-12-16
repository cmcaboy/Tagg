/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: chooseWinner
// ====================================================

export interface chooseWinner_chooseWinner_user {
  __typename: "User";
  id: string | null;
  name: string | null;
  pics: (string | null)[] | null;
}

export interface chooseWinner_chooseWinner_lastMessage {
  __typename: "MessageItem";
  text: string | null;
  name: string | null;
  createdAt: string | null;
}

export interface chooseWinner_chooseWinner {
  __typename: "Match";
  id: string | null;
  matchId: string | null;
  datetimeOfDate: number | null;
  user: chooseWinner_chooseWinner_user | null;
  lastMessage: chooseWinner_chooseWinner_lastMessage | null;
}

export interface chooseWinner {
  chooseWinner: chooseWinner_chooseWinner | null;
}

export interface chooseWinnerVariables {
  id: string;
  winnerId: string;
  dateId: string;
}
