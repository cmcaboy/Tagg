import gql from 'graphql-tag';

export const NEW_USER = gql`
mutation newUser($id: String!, $name: String!, $active: Boolean!, $email: String!, $gender: String!, $description: String, $school: String, $work: String, $sendNotifications: Boolean, $distance: Int, $token: String, $minAgePreference: Int, $maxAgePreference: Int, $pics: [String]) {
    newUser(id: $id, name: $name, active: $active, email: $email, gender: $gender, description: $description, school: $school, work: $work, sendNotifications: $sendNotifications, distance: $distance, token: $token, minAgePreference: $minAgePreference, maxAgePreference: $maxAgePreference, pics: $pics) {
        id
        name
        email
    }
  }
`

export const SET_COORDS = gql`
mutation editUser($id: String!, $latitude: Float, $longtitude: Float) {
    editUser(id: $id, latitude: $latitude, longitude: $longitude) {
        id
        latitude
        longitude
    }
}
`;

export const SET_PUSH_TOKEN = gql`
mutation editUser($id: String!, $token: String) {
    editUser(id: $id, token: $token) {
        id
        token
    }
}
`;

export const LIKE = gql`
mutation likeUser($id: String!, $likedId: String!) {
    likeUser(id: $id, likedId: $likedId) {
        id
        user {
            id
            name
        }
        match
        matchId
    }
}
`;

export const DISLIKE = gql`
mutation dislikeUser($id: String!, $dislikedId: String!) {
    dislikeUser(id: $id, dislikedId: $dislikedId) {
        id
        name
    }
}
`;

export const FOLLOW = gql`
mutation follow($id: String!, $followId: String!) {
    follow(id: $id, followId: $followId) {
        id
        name
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
mutation($matchId: String!, $name: String, $text: String, $createdAt: String, $avatar: String, $order: Float, $uid: String, $_id: String) {
    newMessage(matchId: $matchId, name: $name, text: $text, createdAt: $createdAt, avatar: $avatar, order: $order, uid: $uid, _id: $_id) {
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
mutation editUser($id: String!, $minAgePreference: Int, $maxAgePreference: Int ) {
  editUser(id: $id, minAgePreference: $minAgePreference, maxAgePreference: $maxAgePreference) {
    	id
      minAgePreference
      maxAgePreference
  }
}
`;

export const SET_DISTANCE = gql`
mutation editUser($id: String!, $distance: Int ) {
  editUser(id: $id, distance: $distance) {
    	id
        distance
  }
}
`;


export const SET_NOTIFICATIONS = gql`
mutation editUser($id: String!, $sendNotifications: Boolean ) {
  editUser(id: $id, sendNotifications: $sendNotifications) {
    	id
        sendNotifications
  }
}
`;


export const SET_NAME = gql`
mutation editUser($id: String!, $name: String ) {
  editUser(id: $id, name: $name) {
    	id
      name
  }
}
`
export const SET_AGE = gql`
mutation editUser($id: String!, $age: Int ) {
  editUser(id: $id, age: $age) {
    	id
      age
  }
}
`
export const SET_WORK = gql`
mutation editUser($id: String!, $work: String ) {
  editUser(id: $id, work: $work) {
    	id
      work
  }
}
`
export const SET_SCHOOL = gql`
mutation editUser($id: String!, $school: String ) {
  editUser(id: $id, school: $school) {
    	id
      school
  }
}
`
export const SET_DESCRIPTION = gql`
mutation editUser($id: String!, $description: String ) {
  editUser(id: $id, description: $description) {
    	id
      description
  }
}
`
export const SET_PICS = gql`
mutation editUser($id: String!, $pics: [String] ) {
  editUser(id: $id, pics: $pics) {
    	id
      pics
  }
}
`
