export interface User {
  id: string | null;
  active: boolean | null;
  name: string | null;
  email: string | null;
  age: number | null;
  description: string | null;
  school: string | null;
  work: string | null;
  sendNotifications: boolean | null;
  viewObjectionable: boolean | null;
  gender: string | null;
  distance: number | null;
  token: string | null;
  latitude: number | null;
  longitude: number | null;
  minAgePreference: number | null;
  maxAgePreference: number | null;
  followerDisplay: string | null;
  match: boolean | null;
  distanceApart: number | null;
  order: number | null;
  registerDateTime: number | null;
  pics: string[] | null;
  profilePic: string | null;
  hasDateOpen: boolean | null;
  isFollowing: boolean | null;
  objectionable: boolean | null;
  hostId: string | null;
}
export interface Following {
  id: string | null;
  cursor: number | null;
}
export interface DateBidList {
  id: string | null;
  cursor: number | null;
  list: any | null;
}
export interface DateBid {
  id: string | null;
  datetimeOfBid: number | null;
  bidDescription: string | null;
  bidPlace: string | null;
}
export interface DateItem {
  id: string | null;
  creationTime: string | null;
  datetimeOfDate: number | null;
  description: string | null;
  num_bids: number | null;
  open: boolean | null;
  creationTimeEpoch: number | null;
  order: number | null;
}
export interface DateList {
  id: string | null;
  cursor: number | null;
  list: any | null;
}
export interface Queue {
  id: string | null;
  cursor: number | null;
  list: any | null;
}
export interface MatchList {
  id: string | null;
  cursor: number | null;
  list: any | null;
}
export interface Match {
  id: string | null;
  matchId: string | null;
  winnerId: string | null;
  description: string | null;
  datetimeOfDate: number | null;
}
export interface Message {
  id: string | null;
  cursor: number | null;
  list: any | null;
}
export interface MessageItem {
  name: string | null;
  avatar: string | null;
  _id: string | null;
  createdAt: string | null;
  text: string | null;
  order: number | null;
  uid: string | null;
}
