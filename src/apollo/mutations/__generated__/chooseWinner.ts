/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: chooseWinner
// ====================================================

export interface chooseWinner_chooseWinner {
  __typename: "DateItem";
  id: string | null;
  open: boolean | null;
}

export interface chooseWinner {
  chooseWinner: chooseWinner_chooseWinner | null;
}

export interface chooseWinnerVariables {
  id: string;
  winnerId: string;
  dateId: string;
}
