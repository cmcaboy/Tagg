import { Resolvers } from "../../types/generated";
import { merge } from "lodash";

import { Query } from "./Query";
import { User } from "./User";
import { DateBid } from "./DateBid";
import { DateItem } from "./DateItem";
import { Match } from "./Match";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";
import { DateBidList } from "./DateBidList";
import { DateList } from "./DateList";
import { Following } from "./Following";
import { MatchList } from "./MatchList";
import { Message } from "./Message";
import { MessageItem } from "./MessageItem";
import { Queue } from "./Queue";

export const resolvers: Resolvers = {
  DateBid,
  DateBidList,
  DateItem,
  DateList,
  Following,
  Match,
  MatchList,
  Message,
  MessageItem,
  Mutation,
  Query,
  Queue,
  Subscription,
  User
};
