export interface User {
  id?: string | null;
  active?: boolean;
  name?: string;
  email?: string;
  age?: number;
  description?: string;
  school?: string;
  work?: string;
  sendNotifications?: boolean;
  viewObjectionable?: boolean;
  gender?: string;
  distance?: number;
  token?: string;
  latitude?: number;
  longitude?: number;
  minAgePreference?: number;
  maxAgePreference?: number;
  followerDisplay?: string;
  match?: boolean;
  distanceApart?: number;
  order?: number;
  registerDateTime?: string;
  pics?: string[];
  profilePic?: string;
  hasDateOpen?: boolean;
  isFollowing?: boolean;
  objectionable?: boolean;
}
