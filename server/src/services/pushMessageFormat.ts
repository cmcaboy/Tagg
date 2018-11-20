const moment = require("moment");
//import {moment} from 'moment';

export const createDatePushTitle = (name: string) =>
  `${name} is looking for a date!`;
export const createDatePushBody = (name: string, datetimeOfDate: any) =>
  `${name} is looking for a date at ${formatDate(
    datetimeOfDate
  )}. Hurry and bid on this date!`;
export const formatDate = (date: any) => moment(date).format("MMM D, h:mm a");
// export const formatDate = () => moment.unix(date).format('MMM D, h:mm a');
export const chooseWinnerPushWinnerTitle = (name: string | undefined) =>
  `Congrats! ${name} has accepted your date proposal!`;
export const chooseWinnerPushWinnerBody = (
  name: string | undefined,
  date: any
) =>
  `Congrats! ${name} has accepted your date proposal! Your date is scheduled for ${formatDate(
    date
  )}. You can go ahead and send ${name} a message!`;
export const chooseWinnerPushLoserTitle = (name: string | undefined) =>
  `Unfortunately, ${name} did not select you for her date.`;
export const chooseWinnerPushLoserBody = (
  name: string | undefined,
  date: any
) =>
  `Unfortunately, ${name} did not select you for her date on ${formatDate(
    date
  )}. Don't give up! There are still plenty of dates out there you can win!`;
export const newMessagePushTitle = (name: string) => `new message from ${name}`;
export const newMessagePushBody = (text: string | null) => `${text}`;
