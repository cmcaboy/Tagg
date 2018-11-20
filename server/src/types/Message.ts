import { MessageItem } from "./MessageItem";

export interface Message {
  id: string;
  cursor?: number | null;
  list?: [MessageItem];
}
