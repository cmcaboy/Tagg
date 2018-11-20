import { User } from "./User";

export interface Following {
  id?: string;
  list?: User[];
  cursor?: number | null;
}
