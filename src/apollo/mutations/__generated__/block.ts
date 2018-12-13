/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: block
// ====================================================

export interface block_block {
  __typename: "User";
  id: string | null;
}

export interface block {
  block: block_block | null;
}

export interface blockVariables {
  id: string;
  blockedId: string;
}
