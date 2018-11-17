"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment');
//import {moment} from 'moment';
exports.createDatePushTitle = (name) => `${name} is looking for a date!`;
exports.createDatePushBody = (name, date) => `${name} is looking for a date at ${exports.formatDate(date.datetimeOfDate)}. Hurry and bid on this date!`;
exports.formatDate = (date) => moment(date).format('MMM D, h:mm a');
// export const formatDate = () => moment.unix(date).format('MMM D, h:mm a');
exports.chooseWinnerPushWinnerTitle = (name) => `Congrats! ${name} has accepted your date proposal!`;
exports.chooseWinnerPushWinnerBody = (name, date) => `Congrats! ${name} has accepted your date proposal! Your date is scheduled for ${exports.formatDate(date)}. You can go ahead and send ${name} a message!`;
exports.chooseWinnerPushLoserTitle = (name) => `Unfortunately, ${name} did not select you for her date.`;
exports.chooseWinnerPushLoserBody = (name, date) => `Unfortunately, ${name} did not select you for her date on ${exports.formatDate(date)}. Don't give up! There are still plenty of dates out there you can win!`;
exports.newMessagePushTitle = (name) => `new message from ${name}`;
exports.newMessagePushBody = (text) => `${text}`;
//# sourceMappingURL=pushMessageFormat.js.map