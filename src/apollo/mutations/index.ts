import gql from 'graphql-tag';

export const NEW_DATE = gql`
  mutation createDate($id: String!, $datetimeOfDate: Int, $description: String) {
    createDate(id: $id, datetimeOfDate: $datetimeOfDate, description: $description) {
      id
      creationTime
      datetimeOfDate
      description
    }
  }
`;

export const BID = gql`
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

export const NEW_USER = gql`
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

export const SET_COORDS = gql`
  mutation setCoords($id: String!, $latitude: Float, $longitude: Float) {
    editUser(id: $id, latitude: $latitude, longitude: $longitude) {
      id
      latitude
      longitude
    }
  }
`;

export const SET_PUSH_TOKEN = gql`
  mutation setPushToken($id: String!, $token: String) {
    editUser(id: $id, token: $token) {
      id
      token
    }
  }
`;

export const CHOOSE_WINNER = gql`
  mutation chooseWinner($id: String!, $winnerId: String!, $dateId: String!) {
    chooseWinner(id: $id, winnerId: $winnerId, dateId: $dateId) {
      id
      open
    }
  }
`;

export const FOLLOW = gql`
  mutation follow($id: String!, $followId: String!, $isFollowing: Boolean) {
    follow(id: $id, followId: $followId, isFollowing: $isFollowing) {
      id
      isFollowing
    }
  }
`;

export const UNFOLLOW = gql`
  mutation unFollow($id: String!, $unFollowId: String!) {
    unFollow(id: $id, unFollowId: $unFollowId) {
      id
      name
      isFollowing
    }
  }
`;

export const SEND_MESSAGE = gql`
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

export const SET_AGE_PREFERENCE = gql`
  mutation setAgePreference($id: String!, $minAgePreference: Int, $maxAgePreference: Int) {
    editUser(id: $id, minAgePreference: $minAgePreference, maxAgePreference: $maxAgePreference) {
      id
      minAgePreference
      maxAgePreference
    }
  }
`;

export const SET_DISTANCE = gql`
  mutation setDistance($id: String!, $distance: Int) {
    editUser(id: $id, distance: $distance) {
      id
      distance
    }
  }
`;

export const SET_NOTIFICATIONS = gql`
  mutation setNotifications($id: String!, $sendNotifications: Boolean) {
    editUser(id: $id, sendNotifications: $sendNotifications) {
      id
      sendNotifications
    }
  }
`;

export const SET_FOLLOWER_DISPLAY = gql`
  mutation setFollowerDisplay($id: String!, $followerDisplay: String) {
    editUser(id: $id, followerDisplay: $followerDisplay) {
      id
      followerDisplay
    }
  }
`;

export const SET_NAME = gql`
  mutation setName($id: String!, $name: String) {
    editUser(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const SET_AGE = gql`
  mutation setAge($id: String!, $age: Int) {
    editUser(id: $id, age: $age) {
      id
      age
    }
  }
`;

export const SET_WORK = gql`
  mutation setWork($id: String!, $work: String) {
    editUser(id: $id, work: $work) {
      id
      work
    }
  }
`;

export const SET_SCHOOL = gql`
  mutation setSchool($id: String!, $school: String) {
    editUser(id: $id, school: $school) {
      id
      school
    }
  }
`;

export const SET_DESCRIPTION = gql`
  mutation setDescription($id: String!, $description: String) {
    editUser(id: $id, description: $description) {
      id
      description
    }
  }
`;

export const SET_PICS = gql`
  mutation setPics($id: String!, $pics: [String]) {
    editUser(id: $id, pics: $pics) {
      id
      pics
    }
  }
`;

export const SET_EMAIL = gql`
  mutation setEmail($id: String!, $email: String) {
    editUser(id: $id, email: $email) {
      id
      email
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser($id: String) {
    removeUser(id: $id) {
      id
    }
  }
`;

export const FLAG_USER = gql`
  mutation flag($id: String!, $flaggedId: String!) {
    flag(id: $id, flaggedId: $flaggedId) {
      id
      viewObjectionable
    }
  }
`;

export const FLAG_AND_BLOCK_USER = gql`
  mutation flag($id: String!, $flaggedId: String!, $block: Boolean) {
    flag(id: $id, flaggedId: $flaggedId, block: $block) {
      id
      viewObjectionable
    }
  }
`;

export const BLOCK_USER = gql`
  mutation block($id: String!, $blockedId: String!) {
    block(id: $id, blockedId: $blockedId) {
      id
    }
  }
`;
