import { User } from "./User";

export interface Queue {
  id?: string;
  list?: User[];
  cursor?: number | null;
}
