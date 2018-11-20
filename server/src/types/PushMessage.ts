import { User } from "./User";

interface DataPayload extends User {
  type: string;
  matchId?: string;
  pic?: string;
  otherId?: string | null;
  otherName?: string | undefined | null;
  otherPic?: string | null;
  dateId?: string;
  datetimeOfDate?: string;
}

interface APNS {
  payload: APS;
}

interface APS {
  aps: APSProperties;
}

interface APSProperties {
  badge?: number;
  "content-available": number;
  [propName: string]: any;
}

interface Notification {
  title: string;
  body: string;
}

export interface PushMessage {
  notification: Notification;
  apns: APNS;
  token: string | undefined;
  data: DataPayload;
}
