"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
exports.GET_DATES = graphql_tag_1.default `
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
exports.GET_BIDS = graphql_tag_1.default `
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
exports.GET_PROFILE = graphql_tag_1.default `
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
exports.GET_USER_PROFILE = graphql_tag_1.default `
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
exports.GET_QUEUE = graphql_tag_1.default `
  query getQueue($id: String) {
    user(id: $id) {
      id
      token
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
exports.MORE_QUEUE = graphql_tag_1.default `
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
exports.GET_MATCHES = graphql_tag_1.default `
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
exports.GET_MESSAGES = graphql_tag_1.default `
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
exports.MORE_MESSAGES = graphql_tag_1.default `
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
exports.GET_SETTINGS = graphql_tag_1.default `
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
exports.GET_EDIT_PROFILE = graphql_tag_1.default `
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
exports.CHECK_EMAIL = graphql_tag_1.default `
  query checkEmail($id: String) {
    user(id: $id) {
      id
      email
    }
  }
`;
//# sourceMappingURL=index.js.map