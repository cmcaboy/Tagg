import { User } from "./User";
import { DateItem } from "./DateItem";

export interface DateBid {
  id: string;
  datetimeOfBid?: string;
  bidDescription?: string;
  bidPlace?: string;
  dateUser?: User;
  bidUser?: User;
  date?: DateItem;
}
