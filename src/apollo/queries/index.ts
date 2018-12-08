import gql from 'graphql-tag';

export const GET_DATES = gql`
  query getDates($id: String) {
    user(id: $id) {
      id
      dateRequests {
        id
        list {
          id
          creationTime
          datetimeOfDate
          description
          num_bids
          open
        }
      }
    }
  }
`;

export const GET_BIDS = gql`
  query otherBids($id: String!) {
    otherBids(id: $id) {
      id
      cursor
      list {
        id
        datetimeOfBid
        bidDescription
        bidPlace
        bidUser {
          id
          name
          profilePic
        }
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query getProfile($id: String) {
    user(id: $id) {
      id
      name
      work
      school
      pics
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query getUserProfile($id: String, $hostId: String) {
    user(id: $id, hostId: $hostId) {
      id
      name
      work
      school
      pics
      description
      isFollowing
      hasDateOpen
      distanceApart
    }
  }
`;

// I may expand this later to include date requests for queue users
export const GET_QUEUE = gql`
  query getQueue($id: String) {
    user(id: $id) {
      id
      token
      followerDisplay
      queue {
        id
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
          isFollowing
          hasDateOpen
        }
      }
    }
  }
`;

// Should I return an id here?
export const MORE_QUEUE = gql`
  query moreQueue($followerDisplay: String, $cursor: Float!) {
    moreQueue(followerDisplay: $followerDisplay, cursor: $cursor) {
      id
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
        isFollowing
        hasDateOpen
      }
    }
  }
`;

export const GET_MATCHES = gql`
  query getMatches($id: String) {
    user(id: $id) {
      id
      name
      profilePic
      matchedDates {
        id
        list {
          id
          matchId
          datetimeOfDate
          user {
            id
            name
            pics
          }
          lastMessage {
            text
            name
            createdAt
          }
        }
      }
      dateRequests {
        id
        cursor
        list {
          id
          num_bids
          open
          datetimeOfDate
          description
        }
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query getMessages($id: String!) {
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
  query getSettings($id: String) {
    user(id: $id) {
      id
      minAgePreference
      maxAgePreference
      distance
      sendNotifications
      followerDisplay
    }
  }
`;

export const GET_EDIT_PROFILE = gql`
  query getEditProfile($id: String) {
    user(id: $id) {
      id
      pics
      name
      age
      school
      work
      description
      email
    }
  }
`;

export const CHECK_EMAIL = gql`
  query checkEmail($id: String) {
    user(id: $id) {
      id
      email
    }
  }
`;
