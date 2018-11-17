import { getCurrentDateNeo } from "../middleware/format";

export const newUserDefaults = {
  active: true,
  gender: "female",
  age: 25,
  description: "",
  school: "",
  work: "",
  sendNotifications: true,
  distance: 50,
  token: "",
  latitude: 40.0,
  longitude: -75.0,
  registerDateTime: getCurrentDateNeo(),
  minAgePreference: 18,
  maxAgePreference: 34,
  followerDisplay: "",
  objectionable: false,
  viewObjectionable: true,
  pics: []
};
