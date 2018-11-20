import { User } from "./User";

export interface Bid {
  id: string;
  datetimeOfBid: string;
  bidDescription: string;
  bidPlace: string;
  bidUser: User;
}
