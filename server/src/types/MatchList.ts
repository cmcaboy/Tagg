import { Match } from "./Match";

export interface MatchList {
  id?: string;
  list?: Match[];
  cursor?: number | null;
}
