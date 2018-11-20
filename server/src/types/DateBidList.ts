import { DateBid } from "./DateBid";

export interface DateBidList {
  id?: string;
  list?: DateBid[];
  cursor?: number | null;
}
