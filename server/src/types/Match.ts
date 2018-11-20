import { User } from "./User";
import { Message } from "./Message";
import { MessageItem } from "./MessageItem";

export interface Match {
  id: string;
  matchId?: string;
  user?: User;
  description?: string;
  datetimeOfDate?: string;
  messages?: Message;
  lastMessage?: MessageItem;
}
