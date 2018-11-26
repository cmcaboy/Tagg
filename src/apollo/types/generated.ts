/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: chooseWinner
// ====================================================

export interface chooseWinner {
  __typename: "DateItem";
  open: boolean | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: dateRequests
// ====================================================

export interface dateRequests_list {
  __typename: "DateItem";
  id: string | null;
}

export interface dateRequests {
  __typename: "DateList";
  id: string | null;
  list: (dateRequests_list | null)[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: updateAgePreference
// ====================================================

export interface updateAgePreference {
  __typename: "User";
  minAgePreference: number | null;
  maxAgePreference: number | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: updateDistance
// ====================================================

export interface updateDistance {
  __typename: "User";
  distance: number | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: updateNotifications
// ====================================================

export interface updateNotifications {
  __typename: "User";
  sendNotifications: boolean | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: updateFollowerDisplay
// ====================================================

export interface updateFollowerDisplay {
  __typename: "User";
  followerDisplay: string | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
