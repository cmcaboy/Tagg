const moment = require('moment');
//import {moment} from 'moment';

export const createDatePushTitle = (name) => `${name} is looking for a date!`
export const createDatePushBody = (name, date) => `${name} is looking for a date at ${formatDate(date.datetimeOfDate)}. Hurry and bid on this date!`;
export const formatDate = (date) => moment(date).format('MMM D, h:mm a');
export const chooseWinnerPushWinnerTitle = (name) => `Congrats! ${name} has accepted your date proposal!`
export const chooseWinnerPushWinnerBody = (name,date) => `Congrats! ${name} has accepted your date proposal! Your date is scheduled for ${formatDate(date)}. You can go ahead and send ${name} a message!`
export const chooseWinnerPushLoserTitle = (name) => `Unfortunately, ${name} did not select you for her date.`
export const chooseWinnerPushLoserBody = (name,date) => `Unfortunately, ${name} did not select you for her date on ${formatDate(date)}. Don't give up! There are still plenty of dates out there you can win!`
export const newMessagePushTitle = (name) => `new message from ${name}`;
export const newMessagePushBody = (text) => `${text}`
