"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
exports.NEW_DATE = graphql_tag_1.default `
  mutation createDate($id: String!, $datetimeOfDate: Int, $description: String) {
    createDate(id: $id, datetimeOfDate: $datetimeOfDate, description: $description) {
      id
      creationTime
      datetimeOfDate
      description
    }
  }
`;
exports.BID = graphql_tag_1.default `
  mutation bid($id: String!, $dateId: String!, $bidPlace: String, $bidDescription: String) {
    bid(id: $id, dateId: $dateId, bidPlace: $bidPlace, bidDescription: $bidDescription) {
      id
      datetimeOfBid
      bidDescription
      bidPlace
      date {
        id
        num_bids
      }
    }
  }
`;
exports.NEW_USER = graphql_tag_1.default `
  mutation newUser(
    $id: String!
    $name: String!
    $active: Boolean
    $email: String!
    $gender: String
    $description: String
    $school: String
    $work: String
    $sendNotifications: Boolean
    $distance: Int
    $token: String
    $minAgePreference: Int
    $maxAgePreference: Int
    $latitude: Float
    $longitude: Float
    $followerDisplay: String
    $pics: [String]
  ) {
    newUser(
      id: $id
      name: $name
      active: $active
      email: $email
      gender: $gender
      description: $description
      school: $school
      work: $work
      sendNotifications: $sendNotifications
      distance: $distance
      token: $token
      minAgePreference: $minAgePreference
      maxAgePreference: $maxAgePreference
      latitude: $latitude
      longitude: $longitude
      followerDisplay: $followerDisplay
      pics: $pics
    ) {
      id
      name
      email
    }
  }
`;
exports.SET_COORDS = graphql_tag_1.default `
  mutation setCoords($id: String!, $latitude: Float, $longitude: Float) {
    editUser(id: $id, latitude: $latitude, longitude: $longitude) {
      id
      latitude
      longitude
    }
  }
`;
exports.SET_PUSH_TOKEN = graphql_tag_1.default `
  mutation setPushToken($id: String!, $token: String) {
    editUser(id: $id, token: $token) {
      id
      token
    }
  }
`;
exports.CHOOSE_WINNER = graphql_tag_1.default `
  mutation chooseWinner($id: String!, $winnerId: String!, $dateId: String!) {
    chooseWinner(id: $id, winnerId: $winnerId, dateId: $dateId) {
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
`;
exports.FOLLOW = graphql_tag_1.default `
  mutation follow($id: String!, $followId: String!, $isFollowing: Boolean) {
    follow(id: $id, followId: $followId, isFollowing: $isFollowing) {
      id
      isFollowing
    }
  }
`;
exports.UNFOLLOW = graphql_tag_1.default `
  mutation unFollow($id: String!, $unFollowId: String!) {
    unFollow(id: $id, unFollowId: $unFollowId) {
      id
      name
      isFollowing
    }
  }
`;
exports.SEND_MESSAGE = graphql_tag_1.default `
  mutation sendMessage(
    $matchId: String!
    $name: String
    $text: String
    $createdAt: String
    $avatar: String
    $order: Float
    $uid: String
    $_id: String
    $receiverId: String
  ) {
    newMessage(
      matchId: $matchId
      name: $name
      text: $text
      createdAt: $createdAt
      avatar: $avatar
      order: $order
      uid: $uid
      _id: $_id
      receiverId: $receiverId
    ) {
      name
      text
      createdAt
      avatar
      order
      uid
      _id
    }
  }
`;
exports.SET_AGE_PREFERENCE = graphql_tag_1.default `
  mutation setAgePreference($id: String!, $minAgePreference: Int, $maxAgePreference: Int) {
    editUser(id: $id, minAgePreference: $minAgePreference, maxAgePreference: $maxAgePreference) {
      id
      minAgePreference
      maxAgePreference
    }
  }
`;
exports.SET_DISTANCE = graphql_tag_1.default `
  mutation setDistance($id: String!, $distance: Int) {
    editUser(id: $id, distance: $distance) {
      id
      distance
    }
  }
`;
exports.SET_NOTIFICATIONS = graphql_tag_1.default `
  mutation setNotifications($id: String!, $sendNotifications: Boolean) {
    editUser(id: $id, sendNotifications: $sendNotifications) {
      id
      sendNotifications
    }
  }
`;
exports.SET_FOLLOWER_DISPLAY = graphql_tag_1.default `
  mutation setFollowerDisplay($id: String!, $followerDisplay: String) {
    editUser(id: $id, followerDisplay: $followerDisplay) {
      id
      followerDisplay
    }
  }
`;
exports.SET_NAME = graphql_tag_1.default `
  mutation setName($id: String!, $name: String) {
    editUser(id: $id, name: $name) {
      id
      name
    }
  }
`;
exports.SET_AGE = graphql_tag_1.default `
  mutation setAge($id: String!, $age: Int) {
    editUser(id: $id, age: $age) {
      id
      age
    }
  }
`;
exports.SET_WORK = graphql_tag_1.default `
  mutation setWork($id: String!, $work: String) {
    editUser(id: $id, work: $work) {
      id
      work
    }
  }
`;
exports.SET_SCHOOL = graphql_tag_1.default `
  mutation setSchool($id: String!, $school: String) {
    editUser(id: $id, school: $school) {
      id
      school
    }
  }
`;
exports.SET_DESCRIPTION = graphql_tag_1.default `
  mutation setDescription($id: String!, $description: String) {
    editUser(id: $id, description: $description) {
      id
      description
    }
  }
`;
exports.SET_PICS = graphql_tag_1.default `
  mutation setPics($id: String!, $pics: [String]) {
    editUser(id: $id, pics: $pics) {
      id
      pics
    }
  }
`;
exports.SET_EMAIL = graphql_tag_1.default `
  mutation setEmail($id: String!, $email: String) {
    editUser(id: $id, email: $email) {
      id
      email
    }
  }
`;
exports.REMOVE_USER = graphql_tag_1.default `
  mutation removeUser($id: String) {
    removeUser(id: $id) {
      id
    }
  }
`;
exports.FLAG_USER = graphql_tag_1.default `
  mutation flag($id: String!, $flaggedId: String!) {
    flag(id: $id, flaggedId: $flaggedId) {
      id
      viewObjectionable
    }
  }
`;
exports.FLAG_AND_BLOCK_USER = graphql_tag_1.default `
  mutation flag($id: String!, $flaggedId: String!, $block: Boolean) {
    flag(id: $id, flaggedId: $flaggedId, block: $block) {
      id
      viewObjectionable
    }
  }
`;
exports.BLOCK_USER = graphql_tag_1.default `
  mutation block($id: String!, $blockedId: String!) {
    block(id: $id, blockedId: $blockedId) {
      id
    }
  }
`;
//# sourceMappingURL=mutation.js.map