import gql from 'graphql-tag';

export const GET_PROFILE = gql`
query user($id: String!) {
    user(id: $id) {
        id
        name
        work
        school
        pics
    }
}
`

export const GET_USER_PROFILE = gql`
query user($id: String!) {
  user(id: $id) {
      id
      name
      work
      school
      pics
      description
  }
}
`

export const GET_QUEUE = gql`
query user($id: String!) {
    user(id: $id) {
        id
        queue {
            cursor
            list {
                id
                name
                pics
                age
                description
                work
                school
                distanceApart
                order
                profilePic
            }
        }
    }
  }
`

// Should I return an id here?
export const MORE_QUEUE = gql`
query moreQueue($id: String!, $cursor: Float!) {
    moreQueue(id: $id, cursor: $cursor) {
        cursor
        list {
            id
            name
            pics
            age
            description
            work
            school
            distanceApart
            order
        }
    }
}
`;

export const GET_MATCHES = gql`
query user($id: String!) {
    user(id: $id) {
        id
        name
        profilePic
        matches {
            matchId
            user {
                id
                name
                pics
                age
                description
                work
                school
            }
            lastMessage {
              	text
                name
                createdAt
            }
        }
    }
  }
`;

export const GET_MESSAGES = gql`
query messages($id: String!) {
    messages(id: $id) {
        id
        cursor
        list {
            _id
            name
            text
            createdAt
            avatar
            order
            uid
        }
    }
}
`;

export const GET_MESSAGES_OLD = gql`
query user($id: String!, $otherId: String) {
    user(id: $id) {
        id
        name
        work
        school
        pics
        matches(otherId: $otherId) {
            messages {
                cursor
                list {
                    name
                    text
                    createdAt
                    avatar
                    order
                    uid
                    _id
                }
            }
        }
    }
}
`;

export const MORE_MESSAGES = gql`
query moreMessages($id: String!, $cursor: String!) {
    moreMessages(id: $id, cursor: $cursor) {
        id
        cursor
        list {
            name
            text
            createdAt
            avatar
            order
            uid
            _id
        }
    }
}
`;

export const GET_SETTINGS = gql`
query user($id: String!) {
  user(id: $id) {
      id
      minAgePreference
      maxAgePreference
      distance
      sendNotifications
  }
}
`;

export const GET_EDIT_PROFILE = gql`
query user($id: String!) {
  user(id: $id) {
      id
      pics
      name
      age
      school
      work
      description
  }
}
`
