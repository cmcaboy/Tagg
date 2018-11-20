import { DateItem } from "./DateItem";

export interface DateList {
  id?: string;
  list?: DateItem[];
  cursor?: number | null;
}
