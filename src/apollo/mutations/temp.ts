import gql from 'graphql-tag';

export const BLOCK_USER = gql`
  mutation blockUser($id: String!, $blockedId: String!) {
    block(id: $id, blockedId: $blockedId) {
      id
    }
  }
`;

// export const REMOVE_USER = gql`
//   mutation removeUser($id: String) {
//     removeUser(id: $id) {
//       id
//     }
//   }
// `;
