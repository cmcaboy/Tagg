/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createDate
// ====================================================

export interface createDate_createDate {
  __typename: "DateItem";
  id: string | null;
  creationTime: number | null;
  datetimeOfDate: number | null;
  description: string | null;
}

export interface createDate {
  createDate: createDate_createDate | null;
}

export interface createDateVariables {
  id: string;
  datetimeOfDate?: number | null;
  description?: string | null;
}
