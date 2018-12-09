import { User } from './User';

export interface DateItem {
  id: string;
  dateId?: string;
  creator?: User;
  winner?: User;
  creationTime?: string;
  datetimeOfDate?: number;
  description?: string;
  num_bids?: number;
  open?: boolean;
  creationTimeEpoch?: number;
  order?: number;
  // bids: DateBidList
}
